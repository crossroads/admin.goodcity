import Ember from "ember";
import offers from "./offers";

export default offers.extend({
  sortProperties: ["createdAt:desc"],
  sortedModel: Ember.computed.sort("model", "sortProperties"),
  messagesUtil: Ember.inject.service("messages"),
  store: Ember.inject.service(),

  allMessages: Ember.computed(function() {
    return this.store.peekAll("message");
  }),

  model: Ember.computed(
    "allMessages.@each.state",
    "session.currentUser.id",
    "allMessages.@each.offer.createdBy",
    function() {
      var currentUserId = this.get("session.currentUser.id");

      return this.get("allMessages")
        .rejectBy("state", "never-subscribed")
        .rejectBy("offer.createdBy.id", currentUserId);
    }
  ),

  hasLoadedReadMessages: false,
  showUnread: Ember.computed({
    get: function() {
      return true;
    },
    set: function(key, value) {
      return value;
    }
  }),

  myNotifications: Ember.computed("showUnread", "allNotifications", function() {
    return this.get("showUnread")
      ? this.get("unreadNotifications")
      : this.get("allNotifications");
  }),

  unreadNotifications: Ember.computed("allNotifications.[]", function() {
    return this.get("allNotifications").rejectBy("unreadCount", 0);
  }),

  readNotifications: Ember.computed("allNotifications.[]", function() {
    return this.get("allNotifications").filterBy("unreadCount", 0);
  }),

  allNotifications: Ember.computed("model.@each.state", function() {
    var keys = {};
    var res = [];
    this.get("sortedModel").forEach(message => {
      var isPrivate = message.get("isPrivate");
      var key =
        isPrivate + message.get("offer.id") + (message.get("itemId") || "");
      if (!keys[key]) {
        var props = [
          "id",
          "itemId",
          "offer",
          "sender",
          "createdAt",
          "isPrivate"
        ];
        var notification = Ember.Object.create(message.getProperties(props));
        notification.set(
          "unreadCount",
          message.get("state") === "unread" ? 1 : 0
        );
        notification.set("text", message.get("body"));
        notification.set("isSingleMessage", message.get("state") === "unread");
        if (notification.get("itemId")) {
          notification.set(
            "item",
            this.get("store").peekRecord("item", notification.get("itemId"))
          );
        }

        keys[key] = notification;
        res.push(notification);
      } else if (message.get("state") === "unread") {
        var unreadCount = keys[key].get("unreadCount");
        keys[key].set("unreadCount", unreadCount + 1);
        keys[key].set("isSingleMessage", false);
        keys[key].set("isThread", true);
      }
    });
    return res;
  }),

  actions: {
    view(messageId) {
      var message = this.store.peekRecord("message", messageId);
      var route = this.get("messagesUtil").getRoute(message);
      this.transitionToRoute.apply(this, route);
    },

    markThreadRead(notification) {
      if (notification.unreadCount === 1) {
        var message = this.store.peekRecord("message", notification.id);
        this.get("messagesUtil").markRead(message);
      } else {
        this.send("view", notification.id);
      }
    },

    toggleShowUnread() {
      let showUnread = !this.get("showUnread");

      if (!showUnread && !this.get("hasLoadedReadMessages")) {
        // We want to show all messages, we load them if they haven't been loaded yet
        let loadingView = Ember.getOwner(this)
          .lookup("component:loading")
          .append();
        return this.get("messagesUtil")
          .fetchReadMessages()
          .then(() => {
            this.set("hasLoadedReadMessages", true);
            this.set("showUnread", showUnread);
          })
          .finally(() => loadingView.destroy());
      }

      this.set("showUnread", showUnread);
    },

    markAllRead() {
      var allUnreadMessages = this.get("model").filterBy("state", "unread");
      allUnreadMessages.forEach(m => this.get("messagesUtil").markRead(m));
    }
  }
});
