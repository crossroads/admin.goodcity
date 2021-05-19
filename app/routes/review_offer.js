import Ember from "ember";
import AuthorizeRoute from "./authorize";
import AjaxPromise from "goodcity/utils/ajax-promise";
import { SHAREABLE_TYPES } from "../models/shareable";

export default AuthorizeRoute.extend({
  backLinkPath: Ember.computed.localStorage(),
  sharingService: Ember.inject.service(),

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
    let _this = this;
    let offer = this.get("store").peekRecord("offer", offerId);

    if (offer && this.hasLoadedAssociations(offer)) {
      return offer;
    }

    return new AjaxPromise(
      `/offers/${offerId}`,
      "GET",
      _this.get("session.authToken"),
      { exclude_messages: "true" }
    ).then(function(data) {
      _this.store.pushPayload(data);
      return _this.store.peekRecord("offer", offerId);
    });
  },

  async model() {
    var offerId = this.modelFor("offer").get("id");
    const [offer] = await Ember.RSVP.all([
      this.loadIfAbsent(offerId),
      this.get("sharingService").loadShareable(SHAREABLE_TYPES.OFFER, offerId)
    ]);

    return offer;
  },

  async afterModel(model) {
    await this.store.query("message", {
      messageable_type: "Offer",
      messageable_id: model.get("id")
    });

    let itemIds = model.get("items").getEach("id");

    if (itemIds.length) {
      await this.store.query("message", {
        messageable_type: "Item",
        messageable_id: itemIds
      });
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("displayOfferOptions", false);
    controller.set("displayCompleteReceivePopup", false);
    controller.set("backLinkPath", this.get("backLinkPath"));
  }
});
