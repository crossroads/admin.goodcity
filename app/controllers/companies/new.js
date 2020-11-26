import Ember from "ember";

export default Ember.Controller.extend({
  offerId: Ember.computed.alias("model.id"),
  messageBox: Ember.inject.service(),

  actions: {
    back() {
      this.get("model.company") &&
        this.get("model.company").rollbackAttributes();
      this.transitionToRoute(
        "review_offer.donor_details",
        this.get("model.id")
      );
    },
    saveCompanyAndOffer() {
      if (!this.get("name")) {
        return;
      }
      let offer = this.get("model");
      let name = this.get("name");
      let crmId = this.get("crmId");
      let createdById = this.get("session.currentUser.id");
      let company = this.store.createRecord("company", {
        name: name,
        crmId: crmId,
        createdById: createdById
      });

      company.get("offers").pushObject(offer);
      company
        .save()
        .then(() => {
          offer.save().then(() => {
            this.transitionToRoute(
              "review_offer.donor_details",
              offer.get("id")
            );
          });
        })
        .catch(e =>
          this.get("messageBox").alert(e.errors[0]["detail"].message)
        );
    }
  }
});
