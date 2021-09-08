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
  offerResponse: belongsTo("offerResponse", { async: false }),

  messageableType: attr("string"),
  messageableId: attr("string"),
  unreadCount: attr("string"),

  parsedBody: Ember.computed("body", function() {
    let body = this.get("body");
    body = body.replace(/(<br>)/gm, "\n");
    body = body.replace(/(<)/g, "&lt;");

    let hrefExpressionMatch = body.match(
      /\&lt;a href=(.*?)\>(.*?)\&lt;\/a\s*?\>/
    );
    if (hrefExpressionMatch) {
      body = this.sanitizingAnchorLinks(body, hrefExpressionMatch);
    }
    return body;
  }),

  sanitizingAnchorLinks(body, hrefExpressionMatch) {
    let originalLink = hrefExpressionMatch[0];
    let anchorLink = hrefExpressionMatch[1];
    let text = hrefExpressionMatch[2];
    if (
      anchorLink.includes("/plan_delivery") ||
      anchorLink.includes(
        "crossroads-foundation.formstack.com/forms/goods_donor_survey?field"
      )
    ) {
      body = body.replace(originalLink, `<a href=${anchorLink}>${text}</a>`);
    }
    return body;
  },

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

  itemImageUrl: Ember.computed.alias("item.displayImageUrl"),
  isRead: Ember.computed.equal("state", "read"),
  isUnread: Ember.computed.equal("state", "unread")
});
