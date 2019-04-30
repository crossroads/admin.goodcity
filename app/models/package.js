import { isEqual } from "@ember/utils";
import { computed } from "@ember/object";
import { bool, equal, alias } from "@ember/object/computed";
import DS from "ember-data";
import "../computed/foreign-key";

var attr = DS.attr,
  hasMany = DS.hasMany,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({
  quantity: attr("number"),
  length: attr("number"),
  width: attr("number"),
  height: attr("number"),
  notes: attr("string"),
  state: attr("string", {
    defaultValue: "expecting"
  }),
  state_event: attr("string"),
  receivedAt: attr("date"),
  rejectedAt: attr("date"),
  createdAt: attr("date"),
  updatedAt: attr("date"),
  item: belongsTo("item", {
    async: false
  }),
  packageType: belongsTo("package_type", {
    async: false
  }),
  designation: belongsTo("designation", {
    async: true
  }),
  location: belongsTo("location", {
    async: false
  }),
  donorCondition: belongsTo("donor_condition", {
    async: false
  }),
  ordersPackages: hasMany("orders_package", {
    async: true
  }),
  packageImages: hasMany("package_image", {
    async: false
  }),
  packagesLocations: hasMany("packages_location", {
    async: true
  }),
  offerId: attr("number"),
  inventoryNumber: attr("string"),
  grade: attr("string"),
  sentOn: attr("date"),
  designationId: attr("number"),
  favouriteImageId: attr("number"),
  receivedQuantity: attr("number"),
  packagesLocationsAttributes: attr(),

  isDispatched: bool("sentOn"),
  isDesignated: computed(
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

  donorConditionId: computed.foreignKey("donorCondition.id"),

  isReceived: equal("state", "received"),

  packageName: computed("packageType", function() {
    return this.get("packageType.name");
  }),

  changedNotes: alias("notes"),

  packageTypeId: computed.foreignKey("packageType.id"),

  packageTypeObject: computed("packageType", function() {
    var obj = this.get("packageType").getProperties(
      "id",
      "name",
      "isItemTypeNode"
    );
    obj.id = obj.packageTypeId = parseInt(obj.id, 10);
    return obj;
  }),

  dimensions: computed("width", "height", "length", function() {
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

  displayImageUrl: computed(
    "favouriteImage",
    "item.displayImageUrl",
    function() {
      return this.get("favouriteImage")
        ? this.get("favouriteImage.thumbImageUrl")
        : this.get("item.displayImageUrl");
    }
  ),

  favouriteImage: computed("packageImages.@each.favourite", function() {
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

  hasOneDesignatedPackage: computed(
    "ordersPackages.{@each.quantity,.@each.state,[]",
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

  hasOneDispatchedPackage: computed(
    "ordersPackages.{@each.quantity,@each.state,[]}",
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

  remainingQty: computed(
    "ordersPackages.{@each.quantity,[],@each.state}",
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

  hasAllPackagesDispatched: computed(
    "ordersPackages.{@each.quantity,@each.state,[]}",
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

  hasAllPackagesDesignated: computed(
    "ordersPackages.{@each.quantity,@each.state,[]",
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

  designatedOrdersPackages: computed(
    "ordersPackages.{@each.quantity,@each.state,[]}",
    function() {
      return this.get("ordersPackages").filterBy("state", "designated");
    }
  ),

  dispatchedOrdersPackages: computed(
    "ordersPackages.{@each.quantity,@each.state,[]}",
    function() {
      return this.get("ordersPackages").filterBy("state", "dispatched");
    }
  ),

  totalDispatchedQty: computed(
    "ordersPackages.{@each.quantity,@each.state,[]}",
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

  totalDesignatedQty: computed(
    "ordersPackages.{@each.quantity,@each.state,[]}",
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

  dispatchedItemCount: computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy("state", "dispatched").length;
  }),

  cancelledItemCount: computed("ordersPackages.@each.quantity", function() {
    return this.get("ordersPackages").filterBy("state", "cancelled").length;
  }),

  hasSingleLocation: computed(
    "packagesLocations.{[], @each.quantity}",
    function() {
      return isEqual(this.get("packagesLocations.length"), 1);
    }
  ),

  firstLocationName: computed(
    "packagesLocations.{[],@each.quantity}",
    function() {
      return this.get("packagesLocations.firstObject.location.name");
    }
  ),

  hasMultiLocations: computed(
    "packagesLocations.{[],@each.quantity}",
    function() {
      return this.get("packagesLocations.length") > 1;
    }
  )
});
