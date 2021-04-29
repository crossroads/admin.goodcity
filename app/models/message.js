import Ember from "ember";
import DS from "ember-data";
const { getOwner } = Ember;

var attr = DS.attr,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({
  body: attr("string"),
  isPrivate: attr("boolean"),
  createdAt: attr("date"),
  updatedAt: attr("date"),
  offerId: attr("string"),
  itemId: attr("string"),
  recipientId: attr("string"),
  state: attr("string", { defaultValue: "read" }),
  senderId: attr("string"),
  sender: belongsTo("user", { async: false }),
  item: belongsTo("item", { async: false }),
  offer: belongsTo("offer", { async: false }),

  messageableType: attr("string"),
  messageableId: attr("string"),
  unreadCount: attr("string"),

  myMessage: Ember.computed(function() {
    var session = getOwner(this).lookup("service:session");
    return this.get("sender.id") === session.get("currentUser.id");
  }),

  isMessage: Ember.computed("this", function() {
    return true;
  }),

  createdDate: Ember.computed(function() {
    return new Date(this.get("createdAt")).toDateString();
  }),

  fromCharity: Ember.computed(
    "messageableType",
    "messageableId",
    "senderId",
    "isPrivate",
    "recipientId",
    "isCharityConversation",
    function() {
      if (!this.get("isCharityConversation")) {
        return false;
      }

      // It's a message FROM an external user (a charity) if there is no recipient
      return (
        !this.get("recipientId") &&
        this.get("senderId") !== this.get("offer.createdById")
      );
    }
  ),

  isCharityConversation: Ember.computed(
    "messageableType",
    "messageableId",
    "senderId",
    "isPrivate",
    "recipientId",
    function() {
      if (!this.get("recipientId") || this.get("messageableType") !== "Offer") {
        return false;
      }

      const donorId = this.get("offer.createdById");

      if (!donorId) {
        return !this.get("isPrivate");
      }

      // It's a chat with an external user (a charity) if:
      //  - It's public
      //  - It does not involve the donor
      return (
        !this.get("isPrivate") &&
        this.get("recipientId") !== donorId &&
        this.get("senderId") !== donorId
      );
    }
  ),

  itemImageUrl: Ember.computed.alias("item.displayImageUrl"),
  isRead: Ember.computed.equal("state", "read"),
  isUnread: Ember.computed.equal("state", "unread")
});
