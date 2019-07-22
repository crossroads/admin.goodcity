import AuthorizeRoute from "./../authorize";
import AjaxPromise from "./../../utils/ajax-promise";

export default AuthorizeRoute.extend({
  queryParams: {
    selfReviewer: false
  },
  reviewer: false,

  beforeModel(transition) {
    if (transition.queryParams.selfReviewer) {
      this.set("reviewer", true);
    }
  },

  model() {
    const selfReviewer = this.get("reviewer");
    const recentOfferParams = {
      state: "submitted",
      slug: "search",
      recent_offers: true
    };
    if (selfReviewer) {
      recentOfferParams["selfReview"] = selfReviewer;
    }
    return Ember.RSVP.hash({
      offersCount: new AjaxPromise(
        `/offers/summary?selfReview=${selfReviewer}`,
        "GET",
        this.session.get("authToken")
      ),
      recentOffers: this.get("store").query("offer", recentOfferParams)
    });
  }
});
