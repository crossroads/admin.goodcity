import AuthorizeRoute from "./authorize";
import Ember from "ember";

export default AuthorizeRoute.extend({
  offerService: Ember.inject.service(),

  model(params) {
    if (params.offer_id) {
      return this.get("offerService").fetchOffer(params.offer_id, {
        include_organisations_users: "true"
      });
    }
  },
  setupController(controller, model) {
    controller.set("model", this.modelFor("offer"));
  }
});
