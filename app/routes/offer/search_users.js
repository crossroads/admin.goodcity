import OfferRoute from "./../offer";

export default OfferRoute.extend({
  resetController(controller) {
    controller.set("searchText", "");
  }
});
