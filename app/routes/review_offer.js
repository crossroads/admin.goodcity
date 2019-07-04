import Ember from "ember";
import AuthorizeRoute from "./authorize";
import "./../computed/local-storage";

const BACKLINK_CONDITIONS = {
  isSubmitted: "offers",
  isReceiving: "offers.receiving",
  isReviewed: "in_progress.reviewed",
  isUnderReview: "in_progress.reviewing",
  isClosed: "finished.cancelled",
  isCancelled: "finished.cancelled",
  isReceived: "finished.received",
  isInactive: "finished.inactive",
  isScheduled: {
    "delivery.isGogovan": "scheduled.gogovan",
    "delivery.isDropOff": "scheduled.other_delivery",
    "delivery.isAlternate": "scheduled.collection"
  }
};

export default AuthorizeRoute.extend({
  backLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    if (previousRoute) {
      var parentRoute = previousRoutes[1];
      var hasParentRoute = parentRoute && parentRoute.name === "offers";
      var isSearchRoute = previousRoute.name === "search";

      if (!isSearchRoute && hasParentRoute) {
        this.set("backLinkPath", previousRoute.name);
      } else if (isSearchRoute) {
        this.set("backLinkPath", null);
      }
    }
  },

  hasLoadedAssociations(offer) {
    let items = offer.get("items");
    return items && items.length > 0;
  },

  loadIfAbsent(offerId) {
    let offer = this.get("store").peekRecord("offer", offerId);
    if (offer && this.hasLoadedAssociations(offer)) {
      return offer;
    }
    return this.store.findRecord("offer", offerId, { reload: true });
  },

  model() {
    var offerId = this.modelFor("offer").get("id");
    return this.loadIfAbsent(offerId);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("displayOfferOptions", false);
    controller.set("displayCompleteReceivePopup", false);

    if (this.get("backLinkPath") !== null) {
      controller.set("backLinkPath", this.get("backLinkPath"));
    } else {
      controller.set("backLinkPath", this.getBackLinkPath(model));
    }
  },

  getBackLinkPath(offer, mapping = BACKLINK_CONDITIONS) {
    for (let key in mapping) {
      if (offer.get(key)) {
        const res = mapping[key];
        if (typeof res === "string") {
          return res;
        }
        return this.getBackLinkPath(offer, res); // nested
      }
    }
    return "offers";
  }
});
