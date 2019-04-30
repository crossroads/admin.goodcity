import { computed } from "@ember/object";
import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.sortProperties = ["unreadMessagesCount:desc", "cancelledAt:desc"];
  },

  arrangedContent: sort("model", "sortProperties"),

  displaySearchOfferMessage: true,

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  model: computed("allOffers.@each.state", function() {
    return this.get("allOffers").filterBy("closedOrCancelled");
  })
});
