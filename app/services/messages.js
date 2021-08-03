import Ember from "ember";
const { getOwner } = Ember;
import { AjaxBuilder } from "../utils/ajax-promise";

export default Ember.Service.extend({
  logger: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  subscriptions: Ember.inject.controller(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),

  unreadMessageCount: 0,

  init() {
    this.get("subscriptions").on("create:message", ({ id }) => {
      const msg = this.get("store").peekRecord("message", id);
      if (msg.get("isUnread")) {
        this._incrementCount();
      }
    });

    this.get("subscriptions").on("update:message", ({ id }) => {
      const msg = this.get("store").peekRecord("message", id);
      if (msg.get("state") === "read") {
        this._decrementCount();
      }
    });
  },

  fetchUnreadMessages(page, perPage) {
    return this.fetchMessages(page, perPage, { state: "unread" });
  },

  fetchReadMessages(page, perPage) {
    return this.fetchMessages(page, perPage, { state: "read" });
  },

  fetchMessages(page = 1, perPage = 25, opts = {}) {
    const store = this.get("store");
    return this._queryMessages(page, perPage, opts).then(data => {
      store.pushPayload(data);
      return data.messages.map(m => {
        return store.peekRecord("message", m.id);
      });
    });
  },

  fetchUnreadMessageCount() {
    return this._queryMessages(1, 1, {
      state: "unread",
      scope: "offer,item,offer_response"
    })
      .then(data => {
        const count = data.meta && data.meta.total_count;
        this.set("unreadMessageCount", count || 0);
      })
      .catch(e => this._onError(e));
  },

  markRead(message) {
    if (message.get("isUnread")) {
      var adapter = getOwner(this).lookup("adapter:application");
      var url = adapter.buildURL("message", message.id) + "/mark_read";
      adapter
        .ajax(url, "PUT")
        .then(data => {
          delete data.message.id;
          message.setProperties(data.message);
          this._decrementCount();
        })
        .catch(e => this._onError(e));
    }
  },

  markAllRead() {
    return AjaxBuilder("/messages/mark_all_read")
      .withAuth(this.get("session.authToken"))
      .withQuery({
        scope: "offer,item,offer_response"
      })
      .put()
      .then(() => {
        this.get("store")
          .peekAll("message")
          .filterBy("state", "unread")
          .forEach(message => {
            message.set("state", "read");
          });
        this.set("unreadMessageCount", 0);
      });
  },

  getMessageRoute(
    isPrivate,
    offerId,
    messageableType,
    messageableId,
    senderId
  ) {
    if (messageableType === "OfferResponse") {
      return ["review_offer.share.chat", offerId, senderId];
    }

    if (isPrivate) {
      if (messageableType === "Item") {
        return ["review_item.supervisor_messages", offerId, messageableId];
      } else {
        return ["offer.supervisor_messages", messageableId];
      }
    } else {
      if (messageableType === "Item") {
        return ["review_item.donor_messages", offerId, messageableId];
      } else {
        return ["offer.donor_messages", messageableId];
      }
    }
  },

  getRoute: function(message) {
    if (!message) {
      this.get("messageBox").alert(this.get("i18n").t("404_error"));
      return;
    }

    var messageableType = message.get
      ? message.get("messageableType")
      : message.messageable_type;
    var messageableId = message.get
      ? message.get("messageableId")
      : message.messageable_id;
    var isPrivate = message.get ? message.get("isPrivate") : message.is_private;
    isPrivate = isPrivate
      ? isPrivate.toString().toLowerCase() === "true"
      : false;
    let offerId = message.offer_id;

    let senderId = message.get ? message.get("senderId") : message.author_id;

    var messageRoute = this.getMessageRoute(
      isPrivate,
      offerId,
      messageableType,
      messageableId,
      senderId
    );

    return messageRoute;
  },

  _queryMessages(page = 1, perPage = 25, opts = {}) {
    const { scope = "offer", state } = opts;
    return AjaxBuilder("/messages")
      .withAuth(this.get("session.authToken"))
      .withQuery({ state, scope })
      .getPage(page, perPage);
  },

  _onError(e) {
    this.get("logger").error(e);
  },

  _incrementCount(step = 1) {
    const count = this.get("unreadMessageCount") + step;
    if (count < 0) {
      this.set("unreadMessageCount", 0);
    } else {
      this.set("unreadMessageCount", count);
    }
  },

  _decrementCount() {
    this._incrementCount(-1);
  }
});
