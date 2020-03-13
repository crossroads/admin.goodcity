import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  editItemRequest: "",
  searchLabelRequest: false,

  beforeModel() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    if (previousRoute) {
      var editItemRequest =
        ["review_offer.items", "review_offer.receive"].indexOf(
          previousRoute.name
        ) >= 0;
      this.set("editItemRequest", editItemRequest);

      previousRoute.name == "search_label";
    }

    if (previousRoute && previousRoute.name == "search_label") {
      this.set("searchLabelRequest", true);
    } else {
      this.set("searchLabelRequest", false);
    }
  },

  model(params) {
    return this.store.findRecord("item", params.item_id);
  },

  setupController(controller, model) {
    this._super(controller, model);

    if (
      !this.get("searchLabelRequest") &&
      controller.get("originalPackageType")
    ) {
      controller.set("defaultPackage", controller.get("originalPackageType"));
    }

    if (this.get("editItemRequest")) {
      var itemDetails = {
        donorConditionId: model.get("donorConditionId"),
        donorDescription: model.get("donorDescription")
      };
      controller.set("formData", itemDetails);
    }
  }
});
