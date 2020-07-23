import Ember from "ember";
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";

const { computed } = Ember;

const MSG_KEY = msg => {
  return [
    msg.get("isPrivate") ? "private" : "public",
    msg.get("messageableType") || "-",
    msg.get("messageableId") || "-"
  ].join("/");
};

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

    let notif = notifications.findBy("key", MSG_KEY(msg));

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

    let notification = Ember.Object.create(lastMessage.getProperties(props));
    notification.setProperties({
      key: MSG_KEY(lastMessage),
      item: item,
      messages: messages,
      isSingleMessage: computed.equal("unreadCount", 1),
      isThread: computed.not("isSingleMessage"),
      offer: offer,
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
      .groupBy(MSG_KEY)
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
            .groupBy(MSG_KEY)
            .map(o => this.buildNotifications(o))
            .flatten()
            .value();

          this.get("notifications").addObjects(notifications);
          return notifications;
        });
    },

    view(messageId) {
      var message = this.store.peekRecord("message", messageId);
      var route = this.get("messagesUtil").getRoute(message);
      this.transitionToRoute.apply(this, route);
    },

    markThreadRead(notification) {
      if (notification.unreadCount === 1) {
        var message = this.store.peekRecord("message", notification.id);
        this.get("messagesUtil").markRead(message);
        notification.set("unreadCount", 0);
      } else {
        this.send("view", notification.id);
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
