import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  printerService: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  packageService: Ember.inject.service(),

  model(params) {
    return this.store.findRecord("package", params.package_id);
  },

  setupPrinterId(controller) {
    let defaultPrinter = this.get("printerService").getDefaultPrinter();
    if (defaultPrinter) {
      controller.set("selectedPrinterId", defaultPrinter.id);
    } else {
      let allAvailablePrinters = this.get(
        "printerService"
      ).allAvailablePrinters();
      if (allAvailablePrinters.length) {
        let firstPrinterId = allAvailablePrinters[0].id;
        this.get("printerService").addDefaultPrinter(firstPrinterId);
        controller.set("selectedPrinterId", firstPrinterId);
      }
    }
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set("package", model);
    controller.resetInputs();
    controller.set("displayInventoryOptions", false);
    controller.set("autoGenerateInventory", true);
    controller.set("inputInventory", false);

    this.setupPrinterId(controller);

    if (model.get("isReceived") && model.get("inventoryNumber")) {
      return controller.redirectToReceiveOffer();
    }
    if (!model.get("inventoryNumber")) {
      await controller.generateInventoryNumber();
    } else {
      controller.set("inventoryNumber", model.get("inventoryNumber"));
    }

    const valueHkDollar = await this.get("packageService").getItemValuation({
      donorConditionId: model.get("donorCondition.id"),
      grade: model.get("grade"),
      packageTypeId: model.get("packageType.id")
    });

    controller.set("valueHkDollar", valueHkDollar.value_hk_dollar);
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
