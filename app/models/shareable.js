import Ember from "ember";
import DS from "ember-data";

var attr = DS.attr,
  belongsTo = DS.belongsTo;

export const SHAREABLE_TYPES = {
  OFFER: "Offer",
  PACKAGE: "Package"
};

export default DS.Model.extend({
  allowListing: attr("boolean"),
  publicUid: attr("string"),
  expiresAt: attr("date"),
  resourceId: attr("string"),
  resourceType: attr("string"),
  createdById: attr("string"),
  createdBy: belongsTo("user", { async: false }),
  offerId: attr("string"),
  itemId: attr("string"),
  item: belongsTo("item", { async: false }),
  offer: belongsTo("offer", { async: false }),
  notes: attr("string"),
  notesZhTw: attr("string"),

  active: Ember.computed("expiresAt", function() {
    if (this.get("expiresAt") && typeof this.get("expiresAt") !== "string") {
      return this.get("expiresAt").getTime() > Date.now();
    } else if (!this.get("expiresAt")) {
      return true;
    }
  }).volatile(),

  isPackage: Ember.computed.equal("resourceType", SHAREABLE_TYPES.PACKAGE),
  isOffer: Ember.computed.equal("resourceType", SHAREABLE_TYPES.OFFER)
});
