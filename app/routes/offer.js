import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  model(params) {
    if (params.offer_id) {
      return this.store.findRecord("offer", params.offer_id);
    }
  },
  setupController(controller, model) {
    controller.set("model", this.modelFor("offer"));
  }
});
