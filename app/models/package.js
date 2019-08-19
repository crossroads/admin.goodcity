import DS from "ember-data";
import "../computed/foreign-key";
import Ember from "ember";

var attr = DS.attr,
  hasMany = DS.hasMany,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({
  quantity: attr("number"),
  length: attr("number"),
  width: attr("number"),
  height: attr("number"),
  notes: attr("string"),
  state: attr("string", { defaultValue: "expecting" }),
  state_event: attr("string"),
  receivedAt: attr("date"),
  rejectedAt: attr("date"),
  createdAt: attr("date"),
  updatedAt: attr("date"),
  item: belongsTo("item", { async: false }),
  packageType: belongsTo("package_type", { async: false }),
  designation: belongsTo("designation", { async: true }),
  location: belongsTo("location", { async: false }),
  donorCondition: belongsTo("donor_condition", { async: false }),
  ordersPackages: hasMany("orders_package", { async: true }),
  packageImages: hasMany("package_image", { async: false }),
  packagesLocations: hasMany("packages_location", { async: true }),
  offerId: attr("number"),
  inventoryNumber: attr("string"),
  grade: attr("string"),
  sentOn: attr("date"),
  designationId: attr("number"),
  favouriteImageId: attr("number"),
  receivedQuantity: attr("number"),
  allowWebPublish: attr("boolean"),
  packagesLocationsAttributes: attr(),

  isDispatched: Ember.computed.bool("sentOn"),
  isDesignated: Ember.computed(
    "designationId",
    "sentOn",
    "inventoryNumber",
    function() {
      return (
        this.get("designationId") &&
        this.get("sentOn") === null &&
        this.get("inventoryNumber")
      );
    }
  ),

  donorConditionId: Ember.computed.foreignKey("donorCondition.id"),

  isReceived: Ember.computed.equal("state", "received"),

  packageName: Ember.computed("packageType", function() {
    return this.get("packageType.name");
  }),

  changedNotes: Ember.computed.alias("notes"),

  packageTypeId: Ember.computed.foreignKey("packageType.id"),

  packageTypeObject: Ember.computed("packageType", function() {
    var obj = this.get("packageType").getProperties(
      "id",
      "name",
      "isItemTypeNode"
    );
    obj.id = obj.packageTypeId = parseInt(obj.id, 10);
    return obj;
  }),

  dimensions: Ember.computed("width", "height", "length", function() {
    var res = "";
    var append = val => {
      if (val) {
        res += !res ? val : " x " + val;
      }
    };
    append(this.get("width"));
    append(this.get("height"));
    append(this.get("length"));
    return !res ? "" : res + "cm";
  }),

  displayImageUrl: Ember.computed(
    "favouriteImage",
    "item.displayImageUrl",
    function() {
      return this.get("favouriteImage")
        ? this.get("favouriteImage.thumbImageUrl")
        : this.get("item.displayImageUrl");
    }
  ),

  favouriteImage: Ember.computed("packageImages.@each.favourite", function() {
    return (
      this.get("packageImages")
        .filterBy("favourite")
        .get("firstObject") ||
      this.get("packageImages")
        .sortBy("id")
        .get("firstObject") ||
      this.get("item.displayImage") ||
      null
    );
  }),

  hasOneDesignatedPackage: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      var designatedOrdersPackages = this.get("ordersPackages").filterBy(
        "state",
        "designated"
      );
      return designatedOrdersPackages.get("length") > 1 ||
        designatedOrdersPackages.get("length") === 0
        ? false
        : designatedOrdersPackages[0];
    }
  ),

  hasOneDispatchedPackage: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      var dispatchedOrdersPackages = this.get("ordersPackages").filterBy(
        "state",
        "dispatched"
      );
      return dispatchedOrdersPackages.get("length") > 1 ||
        dispatchedOrdersPackages.get("length") === 0
        ? false
        : dispatchedOrdersPackages[0];
    }
  ),

  remainingQty: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.[]",
    "ordersPackages.@each.state",
    "receivedQuantity",
    function() {
      var qty = 0;
      this.get("ordersPackages").forEach(record => {
        if (record && record.get("state") !== "cancelled") {
          this.store
            .findRecord("ordersPackage", record.get("id"))
            .then((qty += parseInt(record.get("quantity"), 10)));
        }
      });
      return this.get("receivedQuantity") - qty || 0;
    }
  ),

  hasAllPackagesDispatched: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      var ordersPackages = this.store.query("ordersPackage", {
        search_by_package_id: this.get("id")
      });
      var packagesLocations = this.store.query("packagesLocation", {
        search_by_package_id: this.get("id")
      });
      this.store.pushPayload(packagesLocations);
      this.store.pushPayload(ordersPackages);
      var received_quantity = this.get("receivedQuantity");
      var totalDispatchedQty = 0;
      var dispatchedOrdersPackages = this.get("ordersPackages").filterBy(
        "state",
        "dispatched"
      );
      dispatchedOrdersPackages.forEach(record => {
        totalDispatchedQty += parseInt(record.get("quantity"), 10);
      });
      return totalDispatchedQty === received_quantity ? true : false;
    }
  ),

  hasAllPackagesDesignated: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      var received_quantity = this.get("receivedQuantity");
      var totalDesignatedQty = 0;
      var dispatchedOrdersPackages = this.get("ordersPackages").filterBy(
        "state",
        "designated"
      );
      dispatchedOrdersPackages.forEach(record => {
        totalDesignatedQty += parseInt(record.get("quantity"), 10);
      });
      return totalDesignatedQty === received_quantity ? true : false;
    }
  ),

  designatedOrdersPackages: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      return this.get("ordersPackages").filterBy("state", "designated");
    }
  ),

  dispatchedOrdersPackages: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      return this.get("ordersPackages").filterBy("state", "dispatched");
    }
  ),

  totalDispatchedQty: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      var totalDispatchedQty = 0;
      var dispatchedOrdersPackages = this.get("ordersPackages").filterBy(
        "state",
        "dispatched"
      );
      dispatchedOrdersPackages.forEach(record => {
        totalDispatchedQty += parseInt(record.get("quantity"), 10);
      });
      return totalDispatchedQty;
    }
  ),

  totalDesignatedQty: Ember.computed(
    "ordersPackages.@each.quantity",
    "ordersPackages.@each.state",
    "ordersPackages.[]",
    function() {
      var totalDesignatedQty = 0;
      var dispatchedOrdersPackages = this.get("ordersPackages").filterBy(
        "state",
        "designated"
      );
      dispatchedOrdersPackages.forEach(record => {
        totalDesignatedQty += parseInt(record.get("quantity"), 10);
      });
      return totalDesignatedQty;
    }
  ),

  dispatchedItemCount: Ember.computed(
    "ordersPackages.@each.quantity",
    function() {
      return this.get("ordersPackages").filterBy("state", "dispatched").length;
    }
  ),

  cancelledItemCount: Ember.computed(
    "ordersPackages.@each.quantity",
    function() {
      return this.get("ordersPackages").filterBy("state", "cancelled").length;
    }
  ),

  hasSingleLocation: Ember.computed(
    "packagesLocations.[]",
    "packagesLocations.@each.quantity",
    function() {
      return Ember.isEqual(this.get("packagesLocations.length"), 1);
    }
  ),

  firstLocationName: Ember.computed(
    "packagesLocations.[]",
    "packagesLocations.@each.quantity",
    function() {
      return this.get("packagesLocations.firstObject.location.name");
    }
  ),

  hasMultiLocations: Ember.computed(
    "packagesLocations.[]",
    "packagesLocations.@each.quantity",
    function() {
      return this.get("packagesLocations.length") > 1;
    }
  )
});
