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
    this.get("subscriptions").on(
      "update:message",
      this,
      this.onUpdateNotification
    );
  },

  off() {
    this.get("subscriptions").off(
      "create:message",
      this,
      this.onNewNotification
    );
    this.get("subscriptions").off(
      "update:message",
      this,
      this.onUpdateNotification
    );
  },

  onUpdateNotification({ id }) {
    const store = this.get("store");
    const msg = store.peekRecord("message", id);
    let notif = this.get("notifications").findBy(
      "key",
      this.buildMessageKey(msg)
    );

    if (notif) {
      notif.set("unreadCount", null);
    }
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
    let isMessageByCurrentUser =
      this.get("session.currentUser.id") === notif.get("sender.id");

    if (notif) {
      // Update existing one
      notifications.removeObject(notif);
      if (!isMessageByCurrentUser) {
        msg.set("unreadCount", +notif.get("unreadCount") + 1);
      }
      notif.get("messages").addObject(msg);
    } else {
      // Create new one
      if (!isMessageByCurrentUser) {
        msg.set("unreadCount", 1);
      }
      notif = this.messagesToNotification([msg]);
    }

    notifications.insertAt(0, notif);
  },

  loadIfAbsent(modelName, id) {
    let store = this.get("store");
    let cachedRecord = store.peekRecord(modelName, id);
    if (cachedRecord) {
      return cachedRecord;
    }

    return store.findRecord(modelName, id);
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

    let item, offer, offerResponse;
    const lastMessage = messages.sortBy("id").get("lastObject");
    let messageableType = lastMessage.get("messageableType");
    let recordId = lastMessage.get("messageableId");

    let camelCaseValue = _.camelCase(messageableType);

    switch (camelCaseValue) {
      case "offerResponse":
        offerResponse = this.loadIfAbsent(camelCaseValue, recordId);
        Ember.run(() => {
          offerResponse &&
            offerResponse.then(data => {
              offer = this.loadIfAbsent("offer", data.get("offerId"));
            });
        });
        break;
      case "offer":
        offer = this.loadIfAbsent(camelCaseValue, recordId);
        break;
      case "item":
        item = this.loadIfAbsent(camelCaseValue, recordId);
        break;
    }

    let notification = Ember.Object.create(lastMessage.getProperties(props));
    notification.setProperties({
      key: this.buildMessageKey(lastMessage),
      item: item,
      messages: messages,
      offerResponse: offerResponse,
      isSingleMessage: computed.equal("unreadCount", 1),
      isThread: computed.not("isSingleMessage"),
      offer: offer,
      recipientId: this.getRecipientId(lastMessage),
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
        messageable_type: ["Offer", "Item", "OfferResponse"]
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
      const messageId = notification.get("id");
      var message = this.store.peekRecord("message", messageId);

      var route = this.get("messagesUtil").getRoute(message);
      if (message.get("messageableType") === "Item") {
        route[1] = message.get("item.offer.id");
      } else if (message.get("messageableType") === "OfferResponse") {
        route[1] = notification.offerResponse.get("offerId");
      }
      this.transitionToRoute.apply(this, route);
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
