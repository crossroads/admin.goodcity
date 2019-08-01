import Ember from "ember";
import AuthorizeRoute from "./authorize";
import "./../computed/local-storage";

export default AuthorizeRoute.extend({
  backLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop().name;
    if (previousRoute === "search") {
      this.set("backLinkPath", previousRoute);
    } else {
      this.set("backLinkPath", "dashboard");
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
      controller.set("backLinkPath", "dashboard");
    }
  }
});
