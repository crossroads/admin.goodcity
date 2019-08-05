import Ember from "ember";

export default Ember.Controller.extend({
  offerId: Ember.computed.alias("model.id"),

  actions: {
    saveComanyAndOffer() {
      let offer = this.get("model");
      let name = this.get("name");
      let crmId = this.get("crmId");
      let self = this;
      let company = this.store.createRecord("company", {
        name: this.get("name"),
        crmId: this.get("crmId")
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
