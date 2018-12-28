import Ember from 'ember';
const { getOwner } = Ember;
import AjaxPromise from 'goodcity/utils/ajax-promise';

export default Ember.Controller.extend({

  messageBox: Ember.inject.service(),
  cordova: Ember.inject.service(),

  package: Ember.computed.alias("model"),
  watchErrors: true,
  isAndroidDevice: false,
  i18n: Ember.inject.service(),
  reviewOfferController: Ember.inject.controller("review_offer"),

  donorConditions: Ember.computed(function(){
    return this.get("store").peekAll('donor_condition').sortBy('id');
  }),

  selectedCondition: Ember.computed.alias("model.donorCondition"),

  grades: Ember.computed(function(){
    return [
      { name: this.get("i18n").t("receive_package.grade_a"), id: "A" },
      { name: this.get("i18n").t("receive_package.grade_b"), id: "B" },
      { name: this.get("i18n").t("receive_package.grade_c"), id: "C" },
      { name: this.get("i18n").t("receive_package.grade_d"), id: "D" }
    ];
  }),

  selectedGrade: Ember.computed("model", function(){
    var grade = this.get("model.grade");
    return this.get("grades").filterBy('id', grade).get("firstObject");
  }),

  offer: Ember.computed("model", function(){
    return this.get("store").peekRecord("offer", this.get("package.offerId"));
  }),

  identifyDevice: Ember.on('init', function() {
    var isAndroidDevice = this.get("cordova").isAndroid();
    this.set("isAndroidDevice", isAndroidDevice);
  }),

  location: Ember.computed("locationId", function(){
    return this.store.peekRecord("location", this.get("locationId"));
  }),

  locationId: Ember.computed("package", {
    get: function() {
      return this.get("package.location.id") || this.get("package.packageType.location.id");
    },
    set: function(key, value) {
      return value;
    }
  }),

  locations: Ember.computed(function(){
    return this.store.peekAll("location");
  }),

  packageForm: Ember.computed("package.inventoryNumber", {
    get: function() {
      var pkg = this.get('package');
      return {
        quantity: pkg.get("quantity"),
        length: pkg.get("length"),
        width: pkg.get("width"),
        height: pkg.get("height"),
        inventoryNumber: pkg.get("inventoryNumber"),
        notes: pkg.get("notes")
      };
    },
    set: function(key, value) {
      return {
        quantity: value.get("quantity"),
        length: value.get("length"),
        width: value.get("width"),
        height: value.get("height"),
        inventoryNumber: value.get("inventoryNumber"),
        notes: value.get("notes")
      };
    }
  }),

  hasErrors: Ember.computed('invalidQuantity', 'invalidInventoryNo', 'invalidDescription', 'invalidLocation', 'watchErrors', {
    get: function() {
      return this.get("invalidQuantity") || this.get("invalidInventoryNo") || this.get("invalidDescription") || this.get("invalidLocation");
    },
    set: function(key, value) {
      return value;
    }
  }),

  invalidQuantity: Ember.computed({
    get: function() {
      return this.get("package.quantity").length === 0;
    },
    set: function(key, value) {
      return value;
    }
  }),

  invalidLocation: Ember.computed('locationId', {
    get: function() {
      return this.get("locationId") === undefined;
    },
    set: function(key, value) {
      return value;
    }
  }),

  invalidDescription: Ember.computed({
    get: function() {
      return this.get("package.notes").length === 0;
    },
    set: function(key, value) {
      return value;
    }
  }),

  invalidInventoryNo: Ember.computed({
    get: function() {
      var isValid = this.verifyInventoryNumber(this.get("package.inventoryNumber"));
      return isValid;
    },
    set: function(key, value) {
      return value;
    }
  }),

  actions: {
    moveBack(){
      if(this.get("hasErrors")) {
        this.get("package").rollbackAttributes();
      }
      var _this = this;
      var loadingView = getOwner(this).lookup('component:loading').append();
      var pkg = this.get("package");
      var inventoryNumber = pkg.get('inventoryNumber');
      pkg.set('inventoryNumber', null);
      pkg.save()
        .then(() => {
          new AjaxPromise("/inventory_numbers/remove_number", "PUT", _this.get('session.authToken'), { code: inventoryNumber }).then(() => {
            loadingView.destroy();
            _this.transitionToRoute("review_offer.receive");
          });
        })
        .catch(() => {
          loadingView.destroy();
          _this.send('pkgUpdateError', pkg);
        });
    },

    receivePackage() {
      var pkgData = this.get("packageForm");

      this.set("invalidQuantity", (pkgData.quantity.toString().length === 0));
      this.set("invalidDescription", (pkgData.notes.length === 0));

      var validInventory = this.verifyInventoryNumber(pkgData.inventoryNumber);
      this.set("invalidInventoryNo", !validInventory);

      this.notifyPropertyChange("watchErrors"); // this will recalculate 'hasErrors' property, sometimes it does return true for valid form.
      if(this.get("hasErrors")) { return false; }

      var loadingView = getOwner(this).lookup('component:loading').append();
      var pkg = this.get("package");

      var locationId = this.get("locationId.id") || this.get("locationId");
      if(locationId) {
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
      pkg.set("inventoryNumber", pkgData.inventoryNumber);
      pkg.set("grade", this.get("selectedGrade.id"));
      pkg.set("donorCondition", this.get("selectedCondition"));

      pkg.save()
        .then(() => {
          loadingView.destroy();
          pkg.set('packagesLocationsAttributes',{});
          this.transitionToRoute("review_offer.receive");
          Ember.run.scheduleOnce('afterRender', this, () =>
          this.get("reviewOfferController").set("displayCompleteReceivePopup", this.get("offer.readyForClosure")));
        })
        .catch(() => {
          loadingView.destroy();
          this.send('pkgUpdateError', pkg);
        });
    },

    pkgUpdateError(pkg) {
      var errorMessage = pkg.get("errors.firstObject.message") || pkg.get('adapterError.errors.firstObject.title');
      if(errorMessage === "Adapter Error" || errorMessage.indexOf("Connection error") >= 0) {
        this.get("messageBox").alert("could not contact Stockit, try again later.", () => pkg.rollbackAttributes());
      } else {
        this.set("hasErrors", true);
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
