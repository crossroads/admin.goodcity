import OfferRoute from "../offer";

export default OfferRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);
    controller.send("resetInputs");
  }
});
