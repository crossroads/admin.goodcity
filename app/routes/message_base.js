import AuthorizeRoute from "goodcity/routes/authorize";
import Ember from "ember";

export default AuthorizeRoute.extend({
  model() {
    return Ember.RSVP.Promise.all([
      this.store.query("message", {
        messageable_type: "Offer",
        messageable_id: this.modelFor("offer").get("id")
      })
    ]);
  },

  afterModel() {
    var offerId = this.modelFor("offer").get("id");
    this.store.query("version", { item_id: offerId, for_offer: true });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("isActive", true);
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set("isActive", false);
    }
  }
});
