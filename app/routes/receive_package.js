import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  printerService: Ember.inject.service(),

  model(params) {
    return this.store.findRecord("package", params.package_id);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("package", model);
    controller.resetInputs();
    controller.set("displayInventoryOptions", false);
    controller.set("autoGenerateInventory", true);
    controller.set("inputInventory", false);
    model.get("inventoryNumber");
    let allAvailablePrinters = this.get("printerService").allAvailablePrinter();
    let userDefaultPrinter = this.get("printerService.userDefaultPrinter");
    if (!userDefaultPrinter) {
      this.get("printerService").updateUserDefaultPrinter(
        allAvailablePrinters[0].id
      );
    }

    if (model.get("isReceived")) {
      return controller.redirectToReceiveOffer();
    }
    if (!model.get("inventoryNumber")) {
      controller.generateInventoryNumber();
    }
  },

  resetController(controller, isExiting, transition) {
    if (
      controller.get("package.item") &&
      transition.targetName === "offer.search_label"
    ) {
      controller.deleteItem();
    }
  }
});
