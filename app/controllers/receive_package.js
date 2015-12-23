import Ember from 'ember';

export default Ember.Controller.extend({

  package: Ember.computed.alias("model"),
  alert: Ember.inject.service(),

  packageForm: Ember.computed("package", {
    get: function() {
      var pkg = this.get('package');
      return {
        quantity: pkg.get("quantity"),
        length: pkg.get("length"),
        width: pkg.get("width"),
        height: pkg.get("height"),
        inventoryNumber: pkg.get("inventoryNumber"),
      };
    },
    set: function(key, value) {
      return {
        quantity: value.get("quantity"),
        length: value.get("length"),
        width: value.get("width"),
        height: value.get("height"),
        inventoryNumber: value.get("inventoryNumber"),
      };
    }
  }),

  hasErrors: Ember.computed('invalidQuantity', 'invalidInventoryNo',{
    get: function() {
      return this.get("invalidQuantity") || this.get("invalidInventoryNo");
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
      this.transitionToRoute("review_offer.receive");
    },

    receivePackage() {
      var _this = this;
      var pkgData = this.get("packageForm");

      this.set("invalidQuantity", (pkgData.quantity.length === 0));

      var validInventory = this.verifyInventoryNumber(pkgData.inventoryNumber);
      this.set("invalidInventoryNo", !validInventory);

      if(this.get("hasErrors")) { return false; }

      var loadingView = this.container.lookup('component:loading').append();
      var pkg = this.get("package");
      pkg.set("state", "received");
      pkg.set("state_event", "mark_received");
      pkg.set("quantity", pkgData.quantity);
      pkg.set("length", pkgData.length);
      pkg.set("width", pkgData.width);
      pkg.set("height", pkgData.height);
      pkg.set("inventoryNumber", pkgData.inventoryNumber);
      pkg.save()
        .then(() => {
          loadingView.destroy();
          this.transitionToRoute("review_offer.receive");
        })
        .catch(() => {
          loadingView.destroy();
          if(pkg.get("errors.firstObject.attribute") === "connection_error") {
            this.get("alert").show(pkg.get("errors.firstObject.message"), () => {
              pkg.rollbackAttributes();
            });
          } else {
            _this.set("hasErrors", true);
          }
        });
    },

    resetInputs() {
      this.set("invalidQuantity", false);
      this.set("invalidInventoryNo", false);
      this.set("hasErrors", false);
    },
  },

  verifyInventoryNumber: function(value) {
    return /[#{A-Z}][0-9]{5}[a-zA-Z]{0,1}[0-9]*/.test(value);
  },

});
