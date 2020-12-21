import { toID } from "../../utils/helpers";
import AuthorizeRoute from "./../authorize";

export default AuthorizeRoute.extend({
  sharingService: Ember.inject.service(),

  async model() {
    const offer = this.modelFor("offer");

    return this.get("sharingService").loadOfferShareables(offer);
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.set("offer", this.modelFor("offer"));
  }
});
