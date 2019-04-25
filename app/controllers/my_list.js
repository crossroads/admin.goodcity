import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";

export default Controller.extend({
  i18n: service(),

  pageTitle: computed(function() {
    return this.get("i18n").t("inbox.my_list");
  }),

  inProgressCount: computed("reviewerOffers.@each.isUnderReview", function() {
    return this.get("reviewerOffers").filterBy("isUnderReview", true).length;
  }),

  scheduledCount: computed("reviewerOffers.@each.isScheduled", function() {
    return this.get("reviewerOffers").filterBy("isScheduled", true).length;
  }),

  reviewedCount: computed("reviewerOffers.@each.isReviewed", function() {
    return this.get("reviewerOffers").filterBy("isReviewed", true).length;
  }),

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  reviewerOffers: computed(
    "session.currentUser.id",
    "allOffers.@each.reviewedBy",
    function() {
      var currentUserId = this.session.get("currentUser.id");
      return this.get("allOffers").filterBy("reviewedBy.id", currentUserId);
    }
  )
});
