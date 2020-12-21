import DS from "ember-data";
import "../computed/foreign-key";
import Ember from "ember";

var attr = DS.attr,
  hasMany = DS.hasMany,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({
  availableQuantity: attr("number"),
  onHandQuantity: attr("number"),
  dispatchedQuantity: attr("number"),
  designatedQuantity: attr("number"),
  receivedQuantity: attr("number"),
  quantity: Ember.computed.alias("availableQuantity"),
  length: attr("number"),
  width: attr("number"),
  height: attr("number"),
  notes: attr("string"),
  notesZhTw: attr("string"),
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
  packagesLocations: hasMany("packages_location", { async: true }),
  offerId: attr("number"),
  inventoryNumber: attr("string"),
  grade: attr("string"),
  sentOn: attr("date"),
  designationId: attr("number"),
  favouriteImageId: attr("number"),
  packageSetId: attr("number"),
  allowWebPublish: attr("boolean"),
  packagesLocationsAttributes: attr(),

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

  displayImageUrl: Ember.computed("favouriteImage", function() {
    return this.getWithDefault("favouriteImage.thumbImageUrl", "");
  }),

  images: hasMany("image", {
    async: false
  }),

  packageImages: Ember.computed.alias("images"),

  favouriteImage: Ember.computed("images.@each.favourite", function() {
    const images = this.get("images");

    return images.findBy("favourite") || images.sortBy("id").get("firstObject");
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

  hasAllPackagesDispatched: Ember.computed(
    "dispatchedQuantity",
    "onHandQuantity",
    function() {
      return (
        this.get("onHandQuantity") === 0 && this.get("dispatchedQuantity") > 0
      );
    }
  ),

  hasAllPackagesDesignated: Ember.computed(
    "designatedQuantity",
    "availableQuantity",
    function() {
      return (
        this.get("availableQuantity") === 0 &&
        this.get("designatedQuantity") > 0
      );
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
