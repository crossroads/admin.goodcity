import Ember from "ember";
import AsyncTasksMixin from "../mixins/async_tasks";

export default Ember.Controller.extend(AsyncTasksMixin, {
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  application: Ember.inject.controller(),
  appVersion: Ember.computed.alias("application.appVersion"),

  currentUser: Ember.computed("session.currentUser.id", function() {
    return this.store.peekRecord("user", this.get("session.currentUser.id"));
  }),

  newOffersCount: Ember.computed("allOffers.@each.isSubmitted", function() {
    return this.get("allOffers").filterBy("isSubmitted", true).length;
  }),

  receivingOffersCount: Ember.computed(
    "allOffers.@each.isReceiving",
    function() {
      return this.get("allOffers").filterBy("isReceiving", true).length;
    }
  ),

  inProgressOffersCount: Ember.computed(
    "allOffers.@each.isReviewing",
    function() {
      return this.get("allOffers").filterBy("isReviewing", true).length;
    }
  ),

  scheduledCount: Ember.computed("allOffers.@each.isScheduled", function() {
    return this.get("allOffers").filterBy("isScheduled", true).length;
  }),

  myOffersCount: Ember.computed("allOffers.@each.isReviewing", function() {
    var currentUserId = this.session.get("currentUser.id");
    return this.get("allOffers")
      .filterBy("adminCurrentOffer", true)
      .filterBy("reviewedBy.id", currentUserId).length;
  }),

  allOffers: Ember.computed(function() {
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
