import { computed } from "@ember/object";
import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.sortProperties = [
      "unreadMessagesCount:desc",
      "cancelledAt:desc",
      "receivedAt:desc",
      "inactiveAt:desc"
    ];
  },

  arrangedContent: sort("model", "sortProperties"),

  displaySearchOfferMessage: true,

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  model: computed(
    "allOffers.@each.state",
    "session.currentUser.id",
    function() {
      var currentUserId = this.get("session.currentUser.id");
      var currentUser = this.store.peekRecord("user", currentUserId);

      return this.get("allOffers")
        .filterBy("isFinished")
        .filterBy("reviewedBy", currentUser);
    }
  )
});
