import AuthorizeRoute from "./../authorize";

export default AuthorizeRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);
    controller.notifyPropertyChange("itemTypeId");
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      const reviewItem = controller.get("reviewItem");
      if (!reviewItem.get("isPackageTypeChanged")) {
        reviewItem.set(
          "model.packageType",
          reviewItem.get("existingPackageType")
        );
      }
    }
  }
});
