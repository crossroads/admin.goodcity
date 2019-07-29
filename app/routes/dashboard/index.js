import Ember from "ember";
import AuthorizeRoute from "./../authorize";
import AjaxPromise from "./../../utils/ajax-promise";

export default AuthorizeRoute.extend({
  renderTemplate() {
    this.render(); // default template
    this.render("appMenuList", {
      into: "dashboard",
      outlet: "appMenuList",
      controller: "offers"
    });
  },

  model() {
    const recentOfferParams = {
      state: "submitted",
      slug: "search", //slug: is an identifier used in offer adapter to query url `/offers/search`
      recent_offers: true,
      recent_offer_count: 5
    };
    return Ember.RSVP.hash({
      offersCount: new AjaxPromise(
        `/offers/summary`,
        "GET",
        this.session.get("authToken")
      ),
      recentOffers: this.get("store").query("offer", recentOfferParams)
    });
  }
});
