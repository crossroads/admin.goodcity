import { computed } from "@ember/object";
import { sort, alias } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  sortProperties: ["latestUpdatedTime:desc"],
  sortedItems: sort("offerAndItems", "sortProperties"),
  items: alias("model.items"),

  offerAndItems: computed("items.@each.state", function() {
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
    }
  }
});
