import Ember from "ember";
import DS from "ember-data";
import { SHAREABLE_TYPES } from "../services/sharing-service";

var attr = DS.attr,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({
  expiresAt: attr("date"),
  resourceId: attr("string"),
  resourceType: attr("string"),
  createdById: attr("string"),
  createdBy: belongsTo("user", { async: false }),

  offer: Ember.computed("resourceId", "resourceType", function() {
    if (this.get("resourceType") !== SHAREABLE_TYPES.OFFER) {
      return null;
    }
    return this.get("store").peekRecord("offer", this.get("resourceId"));
  }).volatile(),

  active: Ember.computed("expiresAt", function() {
    return (
      !this.get("expiresAt") || this.get("expiresAt").getTime() > Date.now()
    );
  }).volatile()
});
