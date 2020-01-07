import Ember from "ember";

export default Ember.Controller.extend({
  offerId: Ember.computed.alias("model.id"),

  actions: {
    saveCompanyAndOffer() {
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
