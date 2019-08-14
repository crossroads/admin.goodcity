import AuthorizeRoute from "./authorize";
import AjaxPromise from "../utils/ajax-promise";

export default AuthorizeRoute.extend({
  model(params) {
    return this.store.findRecord("package", params.package_id);
  },

  async afterModel(model) {
    if (!model.get("inventoryNumber")) {
      const inventoryNumber = await new AjaxPromise(
        "/packages/print_barcode",
        "POST",
        this.get("session.authToken"),
        { package_id: model.get("id") }
      );
      model.set(
        "inventoryNumber",
        model.set("inventoryNumber", inventoryNumber.inventory_number)
      );
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("package", model);
    controller.send("resetInputs");
    controller.set("displayInventoryOptions", false);
    controller.set("autoGenerateInventory", true);
    controller.set("inputInventory", false);
  }
});
