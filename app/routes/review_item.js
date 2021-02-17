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
    return this.store.findRecord("item", params.item_id);
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.set(
      "existingPackageType",
      model.get("packageType") && model.get("packageType").id
    );

    if (this.get("editItemRequest")) {
      var itemDetails = {
        donorConditionId: model.get("donorConditionId"),
        donorDescription: model.get("donorDescription")
      };
      controller.set("formData", itemDetails);
    }
  }
});
