import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    updateCompany() {
      let self = this;
      let company = this.get("model.company");
      let offer = this.get("model");
      company.set("name", this.get("model.company.name"));
      company.set("crmId", this.get("model.company.crmId"));
      company.set("updatedById", this.get("session.currentUser.id"));

      company.save().then(function() {
        self.transitionToRoute("review_offer.donor_details", offer.get("id"));
      });
    }
  }
});
