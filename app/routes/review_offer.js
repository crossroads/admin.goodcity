import Ember from 'ember';
import AuthorizeRoute from './authorize';
import './../computed/local-storage';

export default AuthorizeRoute.extend({
  backLinkPath: Ember.computed.localStorage(),

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();

    if(previousRoute){
      var parentRoute = previousRoutes[1];
      var hasParentRoute = parentRoute && parentRoute.name === "offers";
      var isSearchRoute = previousRoute.name === "search";

      if(!isSearchRoute && hasParentRoute) {
        this.set("backLinkPath", previousRoute.name);
      } else if(isSearchRoute) {
        this.set("backLinkPath", null);
      }
    }
  },

  hasLoadedAssociations(offer) {
    let items = offer.get('items');
    return items && items.length > 0;
  },

  loadIfAbsent(offerId) {
    let offer = this.get("store").peekRecord("offer", offerId);
    if (offer && this.hasLoadedAssociations(offer)) {
      return offer;
    }
    return this.store.findRecord('offer', offerId);
  },

  model() {
    var offerId = this.modelFor('offer').get('id');
    return this.loadIfAbsent(offerId);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("displayOfferOptions", false);
    controller.set("displayCompleteReceivePopup", false);

    if(this.get('backLinkPath') !== null) {
      controller.set('backLinkPath', this.get('backLinkPath'));
    } else {
      controller.set('backLinkPath', this.getBackLinkPath(model));
    }
  },

  getBackLinkPath(offer) {
    if(offer.get("isSubmitted")) { return "offers"; }
    else if(offer.get("isReceiving")) { return "offers.receiving"; }
    else if(offer.get("isReviewed")) { return "in_progress.reviewed"; }
    else if(offer.get("isUnderReview")) { return "in_progress.reviewing"; }
    else if(offer.get("isClosed") || offer.get("isCancelled")) {
      return "finished.cancelled"; }
    else if(offer.get("isReceived")) { return "finished.received"; }
    else if(offer.get("isInactive")) { return "finished.inactive"; }
    else if(offer.get("isScheduled")) {
      if(offer.get("delivery.isGogovan")) { return "scheduled.gogovan"; }
      else if(offer.get("delivery.isDropOff")) { return "scheduled.other_delivery"; }
      else if(offer.get("delivery.isAlternate")) { return "scheduled.collection"; }
    else { return "offers"; }
    }
  }
});

