import { A } from "@ember/array";
import { resolve } from "rsvp";
import AuthorizeRoute from "./../authorize";

export default AuthorizeRoute.extend({
  currentDonor: null,
  currentOffer: null,

  model() {
    const offerPreload = this.modelFor("reviewOffer");
    return resolve(offerPreload).then(currentOffer => {
      if (!currentOffer) {
        return;
      }
      const donor = currentOffer.get("donor");
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
      return A([]);
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("donor", this.get("currentDonor"));
    controller.set("currentOffer", this.get("currentOffer"));
    [
      "displayCompanyOptions",
      "displayAltPhoneOptions",
      "displayDonorMobileOptions",
      "displayDonorOptions"
    ].forEach(item => {
      controller.set(item, false);
    });
  },

  afterModel(model) {
    if (!model) {
      this.transitionTo("my_list.reviewing");
    }
  }
});
