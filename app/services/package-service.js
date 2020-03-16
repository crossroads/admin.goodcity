import Ember from "ember";
import ApiBaseService from "./api-base-service";

const ID = record => {
  switch (typeof record) {
    case "string":
    case "number":
      return record;
    default:
      return record.get("id");
  }
};

export default ApiBaseService.extend({
  store: Ember.inject.service(),

  generateInventoryNumber() {
    return this.POST(`/inventory_numbers`);
  },

  printBarcode(pkgParams) {
    return this.POST(`/packages/print_barcode`, pkgParams);
  },

  removeInventoryNumber(code) {
    return this.PUT(`/inventory_numbers/remove_number`, code);
  },

  markMissing(pkg) {
    const id = ID(pkg);

    return this.PUT(`/packages/${id}/mark_missing`).then(data => {
      this.get("store").pushPayload(data);
      return this.get("store").peekRecord("package", id);
    });
  }
});
