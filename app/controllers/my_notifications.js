import { later } from "@ember/runloop";
import { resolve } from "rsvp";
import { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { sort, equal, not, alias } from "@ember/object/computed";
import EmberObject, { computed } from "@ember/object";
import { AjaxBuilder } from "goodcity/utils/ajax-promise";
import offers from "./offers";
import _ from "lodash";

const MSG_KEY = msg => {
  return [
    msg.get("isPrivate") ? "private" : "public",
    msg.get("offerId") || "-",
    msg.get("itemId") || "-"
  ].join("/");
};

export default offers.extend({
  sortProperties: ["createdAt:desc"],
  sortedModel: sort("model", "sortProperties"),
  messagesUtil: service("messages"),
  subscriptions: controller(),
  store: service(),
  logger: service(),

  hasLoadedReadMessages: false,
  displayMessages: true,
  showUnread: true,
  notifications: [],

  init() {
    // When a new message arrives, we move it to the top
    this.get("subscriptions").on("create:message", ({ id }) => {
      const store = this.get("store");
      const msg = store.peekRecord("message", id);
      const offerId = msg && msg.get("offerId");
      const notifications = this.get("notifications");

      if (!offerId) {
        return;
      }

      this.loadIfAbsent("offer", offerId).then(() => {
        let notif = notifications.findBy("key", MSG_KEY(msg));
        if (notif) {
          // Update existing one
          notifications.removeObject(notif);
          notif.get("messages").addObject(msg);
        } else {
          // Create new one
          notif = this.messagesToNotification([msg]);
        }
        notifications.insertAt(0, notif);
      });
    });
  },

  /**
   * Creates a single notification out of multiple messages
   *
   * @param {*} messages
   * @returns
   */
  messagesToNotification(messages) {
    const props = ["id", "itemId", "offer", "sender", "createdAt", "isPrivate"];
    const lastMessage = messages.sortBy("createdAt").get("lastObject");
    const item =
      lastMessage.get("itemId") &&
      this.get("store").peekRecord("item", lastMessage.get("itemId"));

    let notification = EmberObject.create(lastMessage.getProperties(props));
    notification.setProperties({
      key: MSG_KEY(lastMessage),
      item: item,
      messages: messages,
      isSingleMessage: equal("messages.length", 1),
      isThread: not("isSingleMessage"),
      offerId: alias("messages.firstObject.offerId"),
      text: computed("messages.[]", function() {
        return this.get("messages")
          .sortBy("createdAt")
          .get("lastObject.body");
      }),
      unreadCount: computed("messages.@each.state", function() {
        return this.get("messages")
          .filterBy("isUnread")
          .get("length");
      })
    });
    return notification;
  },

  /**
   * Transform offers into "notifications" object with more UI-friendly properties
   *
   * @param {Offer} offer
   * @returns {Object}
   */
  buildNotifications(offer) {
    const offerMessages = offer.get("messages").filter(msg => {
      return this.get("showUnread") ? msg.get("isUnread") : true;
    });

    return _.chain(offerMessages)
      .groupBy(MSG_KEY)
      .map(msgs => this.messagesToNotification(msgs))
      .value();
  },

  /**
   * Injects API JSON into the store and returns a list of models
   *
   * @param {Object} data
   * @returns {Offer[]}
   */
  toOfferModels(data) {
    this.get("store").pushPayload(data);
    return data["offers"].map(({ id }) => {
      return this.get("store").peekRecord("offer", id);
    });
  },

  /**
   * Loads a record from either the store or the api
   *
   * @param {String} model
   * @param {String} id
   * @returns {Model}
   */
  loadIfAbsent(model, id) {
    const store = this.get("store");
    return resolve(store.peekRecord(model, id) || store.findRecord(model, id));
  },

  actions: {
    /**
     * Loads a page of offers
     * Used by the infinite list
     *
     * @param {*} pageNo
     * @returns
     */
    loadMoreMessages(pageNo) {
      const state = this.get("showUnread") ? "unread" : "all";

      return new AjaxBuilder("/offers/search")
        .withAuth(this.get("session.authToken"))
        .withQuery({
          with_notifications: state,
          include_messages: true,
          recent_offers: true
        })
        .getPage(pageNo, 10)
        .then(data => this.toOfferModels(data))
        .then(offers => {
          const notifications = _.chain(offers)
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
      later(this, function() {
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
