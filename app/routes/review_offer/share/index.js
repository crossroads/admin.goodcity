import AuthorizeRoute from "../../authorize";

export default AuthorizeRoute.extend({
  model() {
    return this.store.query("offerResponse", {
      offer_response: {
        offer_id: this.modelFor("offer").id
      }
    });
  },

  afterModel(model) {
    model.content.map(offerResponse => {
      this.store.query("message", {
        messageable_type: "OfferResponse",
        messageable_id: offerResponse.id
      });
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("offer", this.modelFor("offer"));
  }
});
