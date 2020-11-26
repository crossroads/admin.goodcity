import Ember from "ember";

export default Ember.Controller.extend({
  messageBox: Ember.inject.service(),
  actions: {
    back() {
      this.get("model.company").rollbackAttributes();
      this.transitionToRoute(
        "review_offer.donor_details",
        this.get("model.id")
      );
    },
    updateCompany() {
      let company = this.get("model.company");
      let offer = this.get("model");
      company.set("name", this.get("model.company.name"));
      company.set("crmId", this.get("model.company.crmId"));
      company.set("updatedById", this.get("session.currentUser.id"));

      company
        .save()
        .then(() => {
          this.transitionToRoute("review_offer.donor_details", offer.get("id"));
        })
        .catch(e =>
          this.get("messageBox").alert(e.errors[0]["detail"].message)
        );
    }
  }
});
