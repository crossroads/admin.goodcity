import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  currentDonor: null,
  currentOffer: null,

  model() {
    var offerId = this.modelFor('reviewOffer').get('id');
    var currentOffer = this.store.peekRecord('offer', offerId);
    if(currentOffer) {
      var donor = currentOffer.get('createdBy');
      this.set("currentDonor", donor);
      this.set("currentOffer", currentOffer);
      return this.store.query('offer', { created_by_id: donor.get('id'), states: ['donor_non_draft'], summarize: 'true' });
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("donor", this.get("currentDonor"));
    controller.set("currentOffer", this.get("currentOffer"));
  },

  afterModel(model) {
    if(!model) {
      this.transitionTo('my_list.reviewing');
    }
  }

});
