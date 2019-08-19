import OfferRoute from "./../offer";
// import Ember from "ember";

export default OfferRoute.extend({
  resetController(controller) {
    controller.set("searchText", "");
  }
});
