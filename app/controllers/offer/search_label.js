import Ember from "ember";
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";
import searchLabelController from "../search_label";

export default searchLabelController.extend({
  packageType: null,
  item: null,

  itemParams() {
    const packageType = this.get("packageType");
    const offer = this.get("model");
    const defaultDonorCondition = this.get("store")
      .peekAll("donorCondition")
      .filterBy("name", "Lightly Used")
      .get("firstObject");
    return {
      offer: offer,
      donorCondition: defaultDonorCondition,
      state: "accepted",
      packageType
    };
  },

  packageParams() {
    const item = this.get("item");
    const pkgType = this.get("packageType");
    const packageTypeId = pkgType.id;

    return {
      notes: item.get("packageType.name"),
      quantity: 1,
      packageTypeId,
      packageType: pkgType,
      offerId: item.get("offer.id"),
      item: item
    };
  },

  addPackage() {
    let pkgRecord = this.store.createRecord("package", this.packageParams());
    this.runTask(
      pkgRecord.save().then(pkg => {
        this.transitionToRoute("receive_package", pkg.id, {
          queryParams: { isUnplannedPackage: true }
        });
      })
    );
  },

  actions: {
    cancelSearch() {
      window.history.back();
    },

    assignItemLabel(type) {
      this.set("packageType", type);
      const item = this.get("store").createRecord("item", this.itemParams());
      item.save().then(itemResponse => {
        this.set("item", itemResponse);
        this.addPackage();
      });
    }
  }
});
