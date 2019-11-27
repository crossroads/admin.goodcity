import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  printerService: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  model(params) {
    return this.store.findRecord("package", params.package_id);
  },

  setupPrinterId(controller) {
    let allAvailablePrinters = this.get("printerService").allAvailablePrinter();
    let user = this.get("session.loggedInUser");
    if (user.get("printerId")) {
      controller.set("selectedPrinterId", user.get("printerId"));
    } else {
      let firstPrinterId = allAvailablePrinters[0].id;
      this.get("printerService").updateUserDefaultPrinter(firstPrinterId);
      controller.set("selectedPrinterId", firstPrinterId);
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("package", model);
    controller.resetInputs();
    controller.set("displayInventoryOptions", false);
    controller.set("autoGenerateInventory", true);
    controller.set("inputInventory", false);
    model.get("inventoryNumber");
    this.setupPrinterId(controller);

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
