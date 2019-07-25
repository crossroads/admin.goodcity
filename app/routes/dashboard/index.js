import AuthorizeRoute from "./../authorize";
import AjaxPromise from "./../../utils/ajax-promise";

export default AuthorizeRoute.extend({
  renderTemplate() {
    this.render(); // default template
    this.render("appMenuList", {
      into: "dashboard",
      outlet: "appMenuList",
      controller: "dashboard"
    });
  },
  model() {
    const selfReviewer = this.get("reviewer");
    const recentOfferParams = {
      state: "submitted",
      slug: "search",
      recent_offers: true,
      recent_offer_per: 5
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
