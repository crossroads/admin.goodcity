import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    saveComanyAndOffer() {
      let name = this.get("model.name");
      let crmId = this.get("model.crmId");
      let self = this;
      let company = this.get("model");
      company.set("name", name);
      company.set("crmId", crmId);
      company.save();
      // company.get("offers").pushObject(offer);
      // company.save().then(function () {
      //   offer.save().then(() => {
      //     self.transitionToRoute("review_offer.donor_details", offer.get("id"));
      //   });
      // });
    }
  }
});
