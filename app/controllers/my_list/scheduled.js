import { computed } from "@ember/object";
import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  sortProperties: [
    "unreadMessagesCount:desc",
    "delivery.schedule.scheduledAt:desc"
  ],
  arrangedContent: sort("model", "sortProperties"),

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
        .filterBy("isScheduled")
        .filterBy("reviewedBy", currentUser);
    }
  )
});
