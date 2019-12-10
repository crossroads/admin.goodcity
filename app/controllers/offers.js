import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Controller, { inject as controller } from "@ember/controller";
import AsyncTasksMixin from "../mixins/async_tasks";

export default Controller.extend(AsyncTasksMixin, {
  store: service(),
  i18n: service(),
  application: controller(),
  appVersion: alias("application.appVersion"),

  currentUser: computed("session.currentUser.id", function() {
    return this.store.peekRecord("user", this.get("session.currentUser.id"));
  }),

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
    },

    createOffer() {
      const now = new Date();
      const offer = this.get("store").createRecord("offer", {
        createdAt: now,
        createdById: null,
        language: this.get("i18n.locale"),
        reviewedAt: now,
        reviewedBy: this.get("currentUser"),
        state: "under_review",
        submittedAt: null
      });

      this.runTask(offer.save()).then(() => {
        this.transitionToRoute("review_offer.items", offer);
      });
    }
  }
});
