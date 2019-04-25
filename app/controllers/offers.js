import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";

export default Controller.extend({
  application: controller(),
  appVersion: alias("application.appVersion"),

  newOffersCount: computed("allOffers.@each.isSubmitted", function() {
    return this.get("allOffers").filterBy("isSubmitted", true).length;
  }),

  receivingOffersCount: computed("allOffers.@each.isReceiving", function() {
    return this.get("allOffers").filterBy("isReceiving", true).length;
  }),

  inProgressOffersCount: computed("allOffers.@each.isReviewing", function() {
    return this.get("allOffers").filterBy("isReviewing", true).length;
  }),

  scheduledCount: computed("allOffers.@each.isScheduled", function() {
    return this.get("allOffers").filterBy("isScheduled", true).length;
  }),

  myOffersCount: computed("allOffers.@each.isReviewing", function() {
    var currentUserId = this.session.get("currentUser.id");
    return this.get("allOffers")
      .filterBy("adminCurrentOffer", true)
      .filterBy("reviewedBy.id", currentUserId).length;
  }),

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  actions: {
    logMeOut() {
      this.get("application").send("logMeOut");
    }
  }
});
