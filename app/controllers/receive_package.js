import Ember from "ember";
const { getOwner } = Ember;
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Ember.Controller.extend({
  // ----- Services -----
  messageBox: Ember.inject.service(),
  cordova: Ember.inject.service(),
  i18n: Ember.inject.service(),

  // ----- Arguments -----
  queryParams: ["isUnplannedPackage"],
  isUnplannedPackage: false,
  inputInventory: false,
  autoGenerateInventory: true,
  displayInventoryOptions: false,
  isAllowedToPublish: false,
  watchErrors: true,
  isAndroidDevice: false,
  displayError: false,

  // ----- Aliases -----
  inventoryNumber: Ember.computed.alias("package.inventoryNumber"),
  package: Ember.computed.alias("model"),
  description: Ember.computed.alias("package.notes"),
  reviewOfferController: Ember.inject.controller("review_offer"),
  selectedCondition: Ember.computed.alias("model.donorConditionId"),

  // ----- Computed Properties -----
  donorConditions: Ember.computed(function() {
    return this.get("store")
      .peekAll("donor_condition")
      .sortBy("id");
  }),

  grades: Ember.computed(function() {
    const i18n = this.get("i18n");
    return [
      { name: i18n.t("receive_package.grade_a"), id: "A" },
      { name: i18n.t("receive_package.grade_b"), id: "B" },
      { name: i18n.t("receive_package.grade_c"), id: "C" },
      { name: i18n.t("receive_package.grade_d"), id: "D" }
    ];
  }),

  selectedGrade: Ember.computed("model", function() {
    const grade = this.get("model.grade");
    return this.get("grades")
      .filterBy("id", grade)
      .get("firstObject");
  }),

  showPublishItemCheckBox: Ember.computed(
    "packageForm.quantity",
    "package.quantity",
    function() {
      this.set("isAllowedToPublish", false);
      return +this.get("packageForm.quantity") === 1;
    }
  ),

  offer: Ember.computed("model", function() {
    return this.get("store").peekRecord("offer", this.get("package.offerId"));
  }),

  identifyDevice: Ember.on("init", function() {
    const isAndroidDevice = this.get("cordova").isAndroid();
    this.set("isAndroidDevice", isAndroidDevice);
  }),

  location: Ember.computed("locationId", function() {
    return this.store.peekRecord("location", this.get("locationId"));
  }),

  locationId: Ember.computed("package", function() {
    return (
      this.get("package.location.id") ||
      this.get("package.packageType.location.id")
    );
  }),

  locations: Ember.computed(function() {
    return this.store.peekAll("location");
  }),

  packageForm: Ember.computed("package", {
    get: function() {
      const pkg = this.get("package");
      return {
        quantity: pkg.get("quantity"),
        length: pkg.get("length"),
        width: pkg.get("width"),
        height: pkg.get("height"),
        labels: pkg.get("quantity")
      };
    }
  }),

  isInvalidQuantity: Ember.computed("packageForm.quantity", function() {
    return this.get("packageForm.quantity") <= 0;
  }),

  isInvalidaLabelCount: Ember.computed("packageForm.labels", function() {
    const labelCount = this.get("packageForm.labels");
    return !labelCount || Number(labelCount) < 0;
  }),

  isMultipleCountPrint: Ember.computed("packageForm.labels", function() {
    const labelCount = Number(this.get("packageForm.labels"));
    return _.inRange(labelCount, 1, 301);
  }),

  isInvalidPrintCount: Ember.computed("packageForm.labels", function() {
    const labelCount = Number(this.get("packageForm.labels"));
    return _.inRange(labelCount, 0, 301);
  }),

  isInvalidDimension: Ember.computed(
    "packageForm.length",
    "packageForm.width",
    "packageForm.height",
    function() {
      const { length, width, height } = this.get("packageForm");
      const dimensionsCount = _.filter(
        [length, width, height],
        item => Number(item) <= 0
      ).length;
      return _.inRange(dimensionsCount, 1, 3);
    }
  ),

  disableReceiveButton: Ember.computed(
    "isInvalidPrintCount",
    "isInvalidaLabelCount",
    "locationId",
    "isInvalidQuantity",
    "inventoryNumber",
    "isInvalidDimension",
    "packageForm.labels",
    function() {
      return (
        this.get("isInvalidQuantity") ||
        !this.get("isInvalidPrintCount") ||
        this.get("isInvalidaLabelCount") ||
        this.get("isInvalidDimension") ||
        !this.get("inventoryNumber") ||
        !this.get("packageForm.labels") ||
        !this.get("locationId")
      );
    }
  ),

  // ----- Helpers -----
  receivePackageParams() {
    const pkgData = this.get("packageForm");
    const inventoryNumber = this.get("inventoryNumber");
    let pkg = this.get("package");
    const locationId = this.get("locationId.id") || this.get("locationId");
    if (locationId) {
      var location = this.get("store").peekRecord("location", locationId);
      pkg.set("location", location);
    }
    pkg.set("state", "received");
    pkg.set("state_event", "mark_received");
    pkg.set("quantity", pkgData.quantity);
    pkg.set("length", pkgData.length);
    pkg.set("width", pkgData.width);
    pkg.set("height", pkgData.height);
    pkg.set("notes", this.get("description"));
    pkg.set("inventoryNumber", inventoryNumber);
    pkg.set("grade", this.get("selectedGrade.id"));
    pkg.set("allowWebPublish", this.get("isAllowedToPublish"));
    pkg.set("donorCondition", this.get("selectedCondition"));
    return pkg;
  },

  showLoadingSpinner() {
    if (Ember.testing) {
      return;
    }
    if (!this.loadingView) {
      this.loadingView = Ember.getOwner(this)
        .lookup("component:loading")
        .append();
    }
  },

  hideLoadingSpinner() {
    if (Ember.testing) {
      return;
    }
    if (this.loadingView) {
      this.loadingView.destroy();
      this.loadingView = null;
    }
  },

  // ----- Ajax Request Methods -----
  removeInventoryNumber() {
    let pkg = this.get("package");
    pkg.set("inventoryNumber", null);
    pkg.save().then(() => this.transitionToRoute("review_offer.receive"));
  },

  generateInventoryNumber() {
    new AjaxPromise(
      "/inventory_numbers",
      "POST",
      this.get("session.authToken")
    ).then(data => this.set("inventoryNumber", data.inventory_number));
  },

  deleteItem() {
    const item = this.get("package.item");
    item
      .destroyRecord()
      .then(() => this.transitionToRoute("review_offer.receive"));
  },

  printBarcode() {
    const packageId = this.get("package.id");
    const labels = this.get("packageForm.labels");
    new AjaxPromise(
      "/packages/print_barcode",
      "POST",
      this.get("session.authToken"),
      { package_id: packageId, labels }
    );
  },

  verifyInventoryNumber: function(value) {
    return /^[A-Z]{0,1}[0-9]{5,6}(Q[0-9]*){0,1}$/i.test(value);
  },

  // ----- Actions -----
  actions: {
    clearDescription() {
      this.set("description", "");
    },

    toggleInventoryOptions() {
      this.toggleProperty("displayInventoryOptions");
    },

    autoGenerateInventoryNumber() {
      this.set("inventoryNumber", "");
      this.set("inputInventory", false);
      this.set("autoGenerateInventory", true);
      this.set("displayInventoryOptions", false);
      this.generateInventoryNumber();
    },

    deleteAutoGeneratedNumber() {
      new AjaxPromise(
        "/inventory_numbers/remove_number",
        "PUT",
        this.get("session.authToken"),
        { code: this.get("inventoryNumber") }
      ).then(() => {
        this.set("inventoryNumber", "");
      });
    },

    editInventoryNumber() {
      this.send("deleteAutoGeneratedNumber");
      this.set("inventoryNumber", "");
      this.set("inputInventory", true);
      this.set("autoGenerateInventory", false);
      this.set("displayInventoryOptions", false);
    },

    assignImageToPackage() {
      const itemId = this.get("package.item.id");
      this.transitionToRoute("item.edit_images", itemId, {
        queryParams: { isUnplannedPackage: true }
      });
    },

    moveBack() {
      this.showLoadingSpinner();
      new AjaxPromise(
        "/inventory_numbers/remove_number",
        "PUT",
        this.get("session.authToken"),
        { code: this.get("package.inventoryNumber") }
      )
        .then(() => {
          if (this.get("isUnplannedPackage")) {
            this.deleteItem();
          } else {
            this.removeInventoryNumber();
          }
        })
        .catch(() => {
          this.send("pkgUpdateError", this.get("package"));
        })
        .finally(() => this.hideLoadingSpinner());
    },

    receivePackage() {
      this.showLoadingSpinner();
      const pkg = this.receivePackageParams();
      pkg
        .save()
        .then(() => {
          if (this.get("isMultipleCountPrint")) {
            this.printBarcode();
          }
          pkg.set("packagesLocationsAttributes", {});
          this.transitionToRoute("review_offer.receive");
          Ember.run.scheduleOnce("afterRender", this, () =>
            this.get("reviewOfferController").set(
              "displayCompleteReceivePopup",
              this.get("offer.readyForClosure")
            )
          );
        })
        .catch(error => {
          console.log("errors:", error);
          this.send("pkgUpdateError", pkg);
        })
        .finally(() => this.hideLoadingSpinner());
    },

    pkgUpdateError(pkg) {
      var errorMessage =
        pkg.get("errors.firstObject.message") ||
        pkg.get("adapterError.errors.firstObject.title");
      if (
        errorMessage === "Adapter Error" ||
        errorMessage.indexOf("Connection error") >= 0
      ) {
        this.get("messageBox").alert(
          "could not contact Stockit, try again later.",
          () => pkg.rollbackAttributes()
        );
      } else {
        this.get("messageBox").alert(
          pkg
            .get("errors")
            .getEach("message")
            .join("\n")
        );
      }
    },

    resetInputs() {
      this.set("invalidQuantity", false);
      this.set("invalidInventoryNo", false);
      this.set("invalidDescription", false);
      this.set("hasErrors", false);
    }
  }
});
