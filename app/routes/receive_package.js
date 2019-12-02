import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
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
    let avaibalePrinter = this.get("store").peekAll("printer");
    controller.set("avaibalePrinter", avaibalePrinter);
    model.get("inventoryNumber");
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
