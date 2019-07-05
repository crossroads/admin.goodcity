import AuthorizeRoute from "./../authorize";
import Ember from "ember";

export default AuthorizeRoute.extend({
  currentDonor: null,
  currentOffer: null,

  model() {
    const offerPreload = this.modelFor("reviewOffer");
    return Ember.RSVP.resolve(offerPreload).then(currentOffer => {
      if (!currentOffer) {
        return;
      }
      const donor = this.getDonor(currentOffer);
      this.set("currentDonor", donor);
      this.set("currentOffer", currentOffer);

      if (donor) {
        return this.store.query(
          "offer",
          {
            created_by_id: donor.get("id"),
            states: ["donor_non_draft"],
            summarize: "true"
          },
          {
            adapterOptions: { reload: true }
          }
        );
      }
      return Ember.A([]);
    });
  },

  getDonor(offer) {
    return offer.get("createdById") && offer.get("createdBy");
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("donor", this.get("currentDonor"));
    controller.set("currentOffer", this.get("currentOffer"));
  },

  afterModel(model) {
    if (!model) {
      this.transitionTo("my_list.reviewing");
    }
  }
});
