import { computed } from "@ember/object";
import { equal } from "@ember/object/computed";
import Model from "ember-data/model";
import attr from "ember-data/attr";
import { hasMany } from "ember-data/relationships";

export default Model.extend({
  status: attr("string"),
  createdAt: attr("date"),
  recentlyUsedAt: attr("date"),
  code: attr("string"),
  activity: attr("string"),
  description: attr("string"),
  detailType: attr("string"),
  detailId: attr("number"),

  ordersPackages: hasMany("ordersPackages", { async: false }),

  isLocalOrder: equal("detailType", "LocalOrder"),

  designatedOrdersPackages: computed("ordersPackages.@each.state", function() {
    return this.get("ordersPackages").filterBy("state", "designated");
  }),

  dispatchedOrdersPackages: computed("ordersPackages.@each.state", function() {
    return this.get("ordersPackages").filterBy("state", "dispatched");
  }),

  designatedItems: computed("items.@each.sentOn", function() {
    return this.get("items").filterBy("sentOn", null);
  }),

  isInactive: computed("status", function() {
    return ["Sent", "Cancelled", "Closed"].indexOf(this.get("status")) >= 0;
  })
});
