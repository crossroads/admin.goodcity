import Ember from "ember";
const { getOwner } = Ember;
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Ember.Controller.extend({
  messageBox: Ember.inject.service(),
  cordova: Ember.inject.service(),
  queryParams: ["isUnplannedPackage"],
  isUnplannedPackage: false,

  package: Ember.computed.alias("model"),
  watchErrors: true,
  isAndroidDevice: false,
  i18n: Ember.inject.service(),
  reviewOfferController: Ember.inject.controller("review_offer"),
  displayError: false,

  donorConditions: Ember.computed(function() {
    return this.get("store")
      .peekAll("donor_condition")
      .sortBy("id");
  }),

  selectedCondition: Ember.computed.alias("model.donorConditionId"),

  grades: Ember.computed(function() {
    return [
      { name: this.get("i18n").t("receive_package.grade_a"), id: "A" },
      { name: this.get("i18n").t("receive_package.grade_b"), id: "B" },
      { name: this.get("i18n").t("receive_package.grade_c"), id: "C" },
      { name: this.get("i18n").t("receive_package.grade_d"), id: "D" }
    ];
  }),

  selectedGrade: Ember.computed("model", function() {
    var grade = this.get("model.grade");
    return this.get("grades")
      .filterBy("id", grade)
      .get("firstObject");
  }),

  offer: Ember.computed("model", function() {
    return this.get("store").peekRecord("offer", this.get("package.offerId"));
  }),

  identifyDevice: Ember.on("init", function() {
    var isAndroidDevice = this.get("cordova").isAndroid();
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

  inventoryNumber: Ember.computed.alias("package.inventoryNumber"),

  packageForm: Ember.computed("package", {
    get: function() {
      const pkg = this.get("package");
      return {
        quantity: pkg.get("quantity"),
        length: pkg.get("length"),
        width: pkg.get("width"),
        height: pkg.get("height"),
        notes: pkg.get("notes")
      };
    }
  }),

  enableDisplayError() {
    this.set("displayError", true);
  },

  isInvalidQuantity: Ember.computed("packageForm.quantity", function() {
    return this.get("packageForm.quantity") < 1;
  }),

  isInvalidLocation: Ember.computed("locationId", function() {
    return !this.get("locationId");
  }),

  isInvalidDescription: Ember.computed("packageForm.notes", function() {
    return this.get("package.notes").length === 0;
  }),

  isInvalidInventoryNo: Ember.computed("inventoryNumber", function() {
    return !this.verifyInventoryNumber(this.get("inventoryNumber"));
  }),

  isPackageInvalid: Ember.computed(
    "isInvalidQuantity",
    "isInvalidInventoryNo",
    "isInvalidDescription",
    "isInvalidLocation",
    function() {
      return (
        this.get("isInvalidQuantity") ||
        this.get("isInvalidInventoryNo") ||
        this.get("isInvalidDescription") ||
        this.get("isInvalidLocation")
      );
    }
  ),

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
    pkg.set("notes", pkgData.notes);
    pkg.set("inventoryNumber", inventoryNumber);
    pkg.set("grade", this.get("selectedGrade.id"));
    pkg.set("donorCondition", this.get("selectedCondition"));
    return pkg;
  },

  actions: {
    addItems() {
      const draftItemId = this.get("package.item.id");
      this.transitionToRoute("item.edit_images", draftItemId);
    },

    moveBack() {
      if (this.get("hasErrors")) {
        this.get("package").rollbackAttributes();
      }
      var _this = this;
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var pkg = this.get("package");
      var inventoryNumber = pkg.get("inventoryNumber");
      pkg.set("inventoryNumber", null);
      pkg
        .save()
        .then(() => {
          new AjaxPromise(
            "/inventory_numbers/remove_number",
            "PUT",
            _this.get("session.authToken"),
            { code: inventoryNumber }
          )
            .then(() => {})
            .catch(() => {})
            .finally(() => _this.transitionToRoute("review_offer.receive"));
        })
        .catch(() => {
          _this.send("pkgUpdateError", pkg);
        })
        .finally(() => loadingView.destroy());
    },

    receivePackage() {
      if (this.get("isPackageInvalid")) {
        this.enableDisplayError();
        return false;
      }
      const loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      const pkg = this.receivePackageParams();
      pkg
        .save()
        .then(() => {
          loadingView.destroy();
          pkg.set("packagesLocationsAttributes", {});
          this.transitionToRoute("review_offer.receive");
          Ember.run.scheduleOnce("afterRender", this, () =>
            this.get("reviewOfferController").set(
              "displayCompleteReceivePopup",
              this.get("offer.readyForClosure")
            )
          );
        })
        .catch(() => {
          loadingView.destroy();
          this.send("pkgUpdateError", pkg);
        });
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
        this.enableDisplayError();
      }
    },

    resetInputs() {
      this.set("invalidQuantity", false);
      this.set("invalidInventoryNo", false);
      this.set("invalidDescription", false);
      this.set("hasErrors", false);
    }
  },

  verifyInventoryNumber: function(value) {
    return /^[A-Z]{0,1}[0-9]{5,6}(Q[0-9]*){0,1}$/i.test(value);
  }
});
