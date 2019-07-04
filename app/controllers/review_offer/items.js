import Ember from "ember";

export default Ember.Controller.extend({
  sortProperties: ["latestUpdatedTime:desc"],
  sortedItems: Ember.computed.sort("offerAndItems", "sortProperties"),
  items: Ember.computed.alias("model.items"),
  reviewOffer: Ember.inject.controller(),

  offerAndItems: Ember.computed("items.@each.state", function() {
    // avoid deleted-items which are not persisted yet.
    var elements = this.get("items")
      .rejectBy("state", "draft")
      .rejectBy("isDeleted", true)
      .toArray();

    // add offer to array for general messages display
    elements.push(this.get("model"));
    return elements;
  }),

  actions: {
    handleBrokenImage() {
      this.get("model.reviewedBy").set("hasImage", null);
    },
    addItem() {
      this.get("reviewOffer").send("addItem");
    }
  }
});
