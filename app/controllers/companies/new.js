import { alias } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  offerId: alias("model.id"),

  actions: {
    saveComanyAndOffer() {
      let offer = this.get("model");
      let name = this.get("name");
      let crmId = this.get("crmId");
      let createdById = this.get("session.currentUser.id");
      let self = this;
      let company = this.store.createRecord("company", {
        name: name,
        crmId: crmId,
        createdById: createdById
      });
      company.get("offers").pushObject(offer);
      company.save().then(function() {
        offer.save().then(() => {
          self.transitionToRoute("review_offer.donor_details", offer.get("id"));
        });
      });
    }
  }
});
