import { computed } from "@ember/object";
import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.sortProperties = [
      "unreadMessagesCount:desc",
      "reviewCompletedAt:desc"
    ];
  },

  arrangedContent: sort("model", "sortProperties"),

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  model: computed("allOffers.@each.state", function() {
    return this.get("allOffers").filterBy("isReviewed");
  })
});
