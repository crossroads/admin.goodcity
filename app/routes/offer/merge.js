import AuthorizeRoute from "./../authorize";

export default AuthorizeRoute.extend({
  offerService: Ember.inject.service(),

  model() {
    var offer = this.modelFor("offer");

    return Ember.RSVP.hash({
      offersForMerge: this.get("offerService").mergeableOffers(offer.get("id")),
      offer: offer
    });
  },

  setupController(controller, model) {
    this._super(controller, model.offer);
    controller.set("offer", model.offer);
    controller.set("offersForMerge", model.offersForMerge);
  }
});
