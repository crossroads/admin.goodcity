import Ember from "ember";
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";
import AsyncTasksMixin from "../mixins/async_tasks";

export default Ember.Controller.extend(AsyncTasksMixin, {
  // ----- Services -----
  messageBox: Ember.inject.service(),
  cordova: Ember.inject.service(),
  i18n: Ember.inject.service(),
  packageService: Ember.inject.service(),
  printerService: Ember.inject.service(),
  session: Ember.inject.service(),

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

  item: Ember.computed.alias("model.item"),
  description: Ember.computed.alias("package.notes"),
  reviewOfferController: Ember.inject.controller("review_offer"),
  selectedCondition: Ember.computed.alias("model.donorCondition"),

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

  allAvailablePrinter: Ember.computed(function() {
    return this.get("printerService").allAvailablePrinter();
  }),

  selectedPrinterDisplay: Ember.computed("selectedPrinterId", function() {
    const printerId = this.get("selectedPrinterId");
    if (printerId) {
      const printer = this.store.peekRecord("printer", printerId);
      return { name: printer.get("name"), id: printer.id };
    }
  }),

  selectedGrade: Ember.computed("model", function() {
    const grade = this.get("model.grade");
    return this.get("grades")
      .filterBy("id", grade)
      .get("firstObject");
  }),

  showPublishItemCheckBox: Ember.computed(
    "packageForm.quantity",
    "package.receivedQuantity",
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
        quantity: pkg.get("receivedQuantity"),
        length: pkg.get("length"),
        width: pkg.get("width"),
        height: pkg.get("height"),
        labels: pkg.get("receivedQuantity")
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
    return this.isValidLabelRange({ startRange: 1 });
  }),

  isInvalidPrintCount: Ember.computed("packageForm.labels", function() {
    return this.isValidLabelRange({ startRange: 0 });
  }),

  printLabelCount: Ember.computed("packageForm.labels", function() {
    return Number(this.get("packageForm.labels"));
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
  verifyInventoryNumber: function(value) {
    return /^[A-Z]{0,1}[0-9]{5,6}(Q[0-9]*){0,1}$/i.test(value);
  },

  resetInputs() {
    this.setProperties({
      "packageForm.length": "",
      "packageForm.width": "",
      "packageForm.height": "",
      // prettier-ignore
      "isAllowedToPublish": ""
    });
  },

  isValidLabelRange({ startRange }) {
    const labelCount = Number(this.get("packageForm.labels"));
    return _.inRange(labelCount, startRange, 301);
  },

  redirectToReceiveOffer() {
    this.transitionToRoute("review_offer.receive");
  },

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
    pkg.set("receivedQuantity", pkgData.quantity);
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

  cancelPackageOptions() {
    const i18n = this.get("i18n");
    this.get("messageBox").custom(
      i18n.t("items.remove_item.confirmation_message"),
      i18n.t("items.remove_item.yes"),
      () => {
        const pkg = this.get("package");
        const item = pkg.get("item");
        this.runTask(
          this.removeInventoryNumber()
            .then(() => {
              const image = item.get("images.firstObject");
              if (image) {
                image.destroyRecord().then(() => {
                  this.deleteItem();
                });
              } else {
                this.deleteItem();
              }
            })
            .catch(() => this.send("pkgUpdateError", pkg))
        );
      },
      i18n.t("items.remove_item.no"),
      null
    );
  },

  // ----- Ajax Request Methods -----
  removeInventoryAndRollbackAttr() {
    let pkg = this.get("package");
    this.runTask(
      this.removeInventoryNumber()
        .then(() => {
          pkg.rollbackAttributes();
          this.redirectToReceiveOffer();
        })
        .catch(() => this.send("pkgUpdateError", pkg))
    );
  },

  removeInventoryNumber() {
    return this.get("packageService").removeInventoryNumber({
      code: this.get("inventoryNumber")
    });
  },

  generateInventoryNumber() {
    this.runTask(
      this.get("packageService")
        .generateInventoryNumber()
        .then(data => this.set("inventoryNumber", data.inventory_number))
    );
  },

  deleteItem() {
    const item = this.get("package.item");
    this.runTask(
      item.destroyRecord().then(() => this.redirectToReceiveOffer())
    );
  },

  printBarcode() {
    const packageId = this.get("package.id");
    const labels = this.get("packageForm.labels");
    this.get("packageService")
      .printBarcode({
        package_id: packageId,
        labels,
        printer_id: this.get("selectedPrinterId")
      })
      .catch(error => {
        this.get("messageBox").alert(
          error.responseJSON.errors && error.responseJSON.errors[0]
        );
      });
  },

  // ----- Actions -----
  actions: {
    clearDescription() {
      this.set("description", "");
    },

    toggleInventoryOptions() {
      this.toggleProperty("displayInventoryOptions");
    },

    setPrinterValue(value) {
      const printerId = value.id;
      this.set("selectedPrinterId", printerId);
      this.get("printerService").updateUserDefaultPrinter(printerId);
    },

    autoGenerateInventoryNumber() {
      this.set("inventoryNumber", "");
      this.set("inputInventory", false);
      this.set("autoGenerateInventory", true);
      this.set("displayInventoryOptions", false);
      this.generateInventoryNumber();
    },

    deleteAutoGeneratedNumber() {
      this.runTask(
        this.removeInventoryNumber().then(() => {
          this.set("inventoryNumber", "");
        })
      );
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
      if (this.get("isUnplannedPackage")) {
        this.cancelPackageOptions();
      } else {
        this.removeInventoryAndRollbackAttr();
      }
    },

    receivePackage() {
      const pkg = this.receivePackageParams();
      this.runTask(
        pkg
          .save()
          .then(() => {
            if (this.get("isMultipleCountPrint")) {
              this.printBarcode();
            }
            pkg.set("packagesLocationsAttributes", {});
            this.redirectToReceiveOffer();
            Ember.run.scheduleOnce("afterRender", this, () =>
              this.get("reviewOfferController").set(
                "displayCompleteReceivePopup",
                this.get("offer.readyForClosure")
              )
            );
          })
          .catch(() => this.send("pkgUpdateError", pkg))
      );
    },

    pkgUpdateError(pkg) {
      const errorMessage =
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
    }
  }
});
