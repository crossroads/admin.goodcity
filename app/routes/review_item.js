import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  editItemRequest: "",

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    if (previousRoute) {
      var editItemRequest =
        ["review_offer.items", "review_offer.receive"].indexOf(
          previousRoute.name
        ) >= 0;
      this.set("editItemRequest", editItemRequest);
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      item: this.store.findRecord("item", params.item_id),
      donorConditions: this.store.query("donor_condition", {})
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    const item = model.item;
    controller.set("donorConditions", model.donorConditions);
    controller.set("model", item);
    if (this.get("editItemRequest")) {
      var itemDetails = {
        donorConditionId: item.get("donorConditionId"),
        donorDescription: item.get("donorDescription")
      };
      controller.set("formData", itemDetails);
    }
  }
});
