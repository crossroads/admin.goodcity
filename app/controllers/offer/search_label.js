import searchLabelController from "../search_label";

export default searchLabelController.extend({
  // ----- Arguments -----
  packageType: null,
  item: null,

  //--Ajax Methods
  createItem() {
    const item = this.get("store").createRecord("item", this.itemParams());
    this.runTask(
      item.save().then(itemResponse => {
        this.set("item", itemResponse);
        this.addPackage();
      })
    );
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

  donorConditions: Ember.computed(function() {
    return this.get("store").peekAll("donorCondition");
  }),

  //--Params helpers
  itemParams() {
    const conditions = this.get("donorConditions");
    const defaultDonorCondition =
      conditions.filterBy("name", "Lightly Used").get("firstObject") ||
      conditions.get("firstObject");
    return {
      offer: this.get("model"),
      donorCondition: defaultDonorCondition,
      state: "accepted",
      packageType: this.get("packageType")
    };
  },

  packageParams() {
    const item = this.get("item");
    const pkgType = this.get("packageType");
    const packageTypeId = pkgType.id;

    return {
      notes: item.get("packageType.name"),
      receivedQuantity: 1,
      packageTypeId,
      packageType: pkgType,
      offerId: item.get("offer.id"),
      item: item
    };
  },

  // ----- Actions -----
  actions: {
    cancelSearch() {
      window.history.back();
    },

    assignItemLabel(type) {
      this.set("packageType", type);
      this.createItem();
    }
  }
});
