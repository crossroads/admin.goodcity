import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";

export default Controller.extend({
  i18n: service(),

  pageTitle: computed(function() {
    return this.get("i18n").t("inbox.in_review");
  }),

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  reviewedCount: computed("allOffers.@each.isReviewed", function() {
    return this.get("allOffers").filterBy("isReviewed", true).length;
  }),

  underReviewCount: computed("allOffers.@each.isUnderReview", function() {
    return this.get("allOffers").filterBy("isUnderReview", true).length;
  })
});
