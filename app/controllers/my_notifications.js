import Ember from "ember";
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";

const { computed } = Ember;

export default Ember.Controller.extend({
  messagesUtil: Ember.inject.service("messages"),
  subscriptions: Ember.inject.controller(),
  store: Ember.inject.service(),
  logger: Ember.inject.service(),

  hasLoadedReadMessages: false,
  displayMessages: true,
  showUnread: true,
  notifications: [],

  on() {
    // When a new message arrives, we move it to the top
    this.get("subscriptions").on(
      "create:message",
      this,
      this.onNewNotification
    );
  },

  off() {
    this.get("subscriptions").off(
      "create:message",
      this,
      this.onNewNotification
    );
  },

  onNewNotification({ id }) {
    const store = this.get("store");
    const msg = store.peekRecord("message", id);
    const messageableId = msg.get("messageableId");
    const notifications = this.get("notifications");

    if (!messageableId) {
      return;
    }

    let notif = notifications.findBy("key", this.buildMessageKey(msg));

    if (notif) {
      // Update existing one
      notifications.removeObject(notif);
      msg.set("unreadCount", +notif.get("unreadCount") + 1);
      notif.get("messages").addObject(msg);
    } else {
      // Create new one
      msg.set("unreadCount", 1);
      notif = this.messagesToNotification([msg]);
    }

    notifications.insertAt(0, notif);
  },

  /**
   * Creates a single notification out of multiple messages
   *
   * @param {*} messages
   * @returns
   */
  messagesToNotification(messages) {
    const props = [
      "id",
      "itemId",
      "offerId",
      "sender",
      "createdAt",
      "isPrivate"
    ];

    let item, offer;
    const lastMessage = messages.sortBy("id").get("lastObject");
    let messageableType = lastMessage.get("messageableType");
    let recordId = lastMessage.get("messageableId");

    if (messageableType === "Item") {
      item =
        this.get("store").peekRecord("item", recordId) ||
        this.get("store").findRecord("item", recordId);
    } else if (messageableType === "Offer") {
      offer =
        this.get("store").peekRecord("offer", recordId) ||
        this.get("store").findRecord("offer", recordId);
    }

    let controller = this;
    let notification = Ember.Object.create(lastMessage.getProperties(props));
    notification.setProperties({
      key: this.buildMessageKey(lastMessage),
      item: item,
      messages: messages,
      isSingleMessage: computed.equal("unreadCount", 1),
      isThread: computed.not("isSingleMessage"),
      offer: offer,
      recipientId: this.getRecipientId(lastMessage),
      isCharity: computed("offer.createdById", function() {
        return controller.isCharityDiscussion(this.get("messages.lastObject"));
      }),
      text: computed("messages.[]", function() {
        return this.get("messages")
          .sortBy("id")
          .get("lastObject.body");
      }),
      unreadCount: computed("messages.@each.unreadCount", "messages.[]", {
        get() {
          let lastMessage = this.get("messages")
            .sortBy("id")
            .get("lastObject");
          return lastMessage.get("unreadCount");
        },
        set(key, value) {
          return value;
        }
      })
    });
    return notification;
  },

  /**
   * Transform offers into "notifications" object with more UI-friendly properties
   */
  buildNotifications(messages) {
    const groupedMessages = messages.filter(msg => {
      return this.get("showUnread") ? msg.get("isUnread") : true;
    });

    return _.chain(groupedMessages)
      .groupBy(m => this.buildMessageKey(m))
      .map(msgs => this.messagesToNotification(msgs))
      .value();
  },

  /**
   * Injects API JSON into the store and returns a list of models
   *
   * @param {Object} data
   * @returns {Message[]}
   */
  toMessageModels(data) {
    this.get("store").pushPayload(data);
    return data.messages.map(({ id }) => {
      return this.get("store").peekRecord("message", id);
    });
  },

  buildMessageKey(msg) {
    return [
      msg.get("isPrivate") ? "private" : "public",
      msg.get("messageableType") || "-",
      msg.get("messageableId") || "-",
      this.getRecipientId(msg) || "-"
    ].join("/");
  },

  getRecipientId(msg) {
    if (msg.get("isPrivate")) {
      return null;
    }

    if (msg.get("recipientId")) {
      // Case: staff is sending the message
      return msg.get("recipientId");
    }

    // Case: user is sending the message
    return msg.get("senderId");
  },

  isCharityDiscussion(message) {
    if (
      message.get("messageableType") !== "Offer" ||
      message.get("isPrivate")
    ) {
      return false;
    }

    const donorId = message.get("offer.createdById");

    return (
      message.get("senderId") !== donorId &&
      message.get("recipientId") !== donorId
    );
  },

  actions: {
    /**
     * Loads a page of Message Notifications
     * Used by the infinite list
     *
     * @param {*} pageNo
     * @returns
     */
    loadMoreMessages(pageNo) {
      const state = this.get("showUnread") ? "unread" : "";

      const params = {
        page: pageNo,
        state: state,
        messageable_type: ["offer", "item"]
      };

      return new AjaxPromise(
        "/messages/notifications",
        "GET",
        this.get("session.authToken"),
        params
      )
        .then(data => this.toMessageModels(data))
        .then(messages => {
          const notifications = _.chain(messages)
            .groupBy(m => this.buildMessageKey(m))
            .map(o => this.buildNotifications(o))
            .flatten()
            .value();

          this.get("notifications").addObjects(notifications);
          return notifications;
        });
    },

    view(notification) {
      if (notification.get("isCharity")) {
        this.transitionToRoute(
          "review_offer.share.chat",
          notification.get("offer.id"),
          notification.get("recipientId")
        );
      } else {
        const messageId = notification.get("id");
        var message = this.store.peekRecord("message", messageId);
        var route = this.get("messagesUtil").getRoute(message);
        this.transitionToRoute.apply(this, route);
      }
    },

    markThreadRead(notification) {
      if (notification.unreadCount === 1) {
        var message = this.store.peekRecord("message", notification.id);
        this.get("messagesUtil").markRead(message);
        notification.set("unreadCount", 0);
      } else {
        this.send("view", notification);
      }
    },

    toggleShowUnread() {
      this.set("displayMessages", false);
      this.get("notifications").clear();
      Ember.run.later(this, function() {
        let showUnread = !this.get("showUnread");
        this.set("showUnread", showUnread);
        this.set("displayMessages", true);
      });
    },

    markAllRead() {
      this.get("messagesUtil")
        .markAllRead()
        .then(() => {
          this.get("notifications").forEach(n => {
            n.set("unreadCount", 0);
          });
        })
        .catch(e => {
          this.get("logger").error(e);
        });
    }
  }
});
