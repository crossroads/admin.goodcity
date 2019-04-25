import { get } from "@ember/object";
import { test, moduleForModel } from "ember-qunit";

moduleForModel("package", "Package Model", {
  needs: [
    "model:item",
    "model:package_type",
    "model:designation",
    "model:location",
    "model:donor_condition",
    "model:orders_package",
    "model:package_image",
    "model:packages_location"
  ]
});

test("check attributes", function(assert) {
  assert.expect(18);
  var model = this.subject();
  var state_event = Object.keys(model.toJSON()).indexOf("state_event") > -1;
  var state = Object.keys(model.toJSON()).indexOf("state") > -1;
  var receivedQuantity =
    Object.keys(model.toJSON()).indexOf("receivedQuantity") > -1;
  var favouriteImageId =
    Object.keys(model.toJSON()).indexOf("favouriteImageId") > -1;
  var designationId = Object.keys(model.toJSON()).indexOf("designationId") > -1;
  var sentOn = Object.keys(model.toJSON()).indexOf("sentOn") > -1;
  var grade = Object.keys(model.toJSON()).indexOf("grade") > -1;
  var inventoryNumber =
    Object.keys(model.toJSON()).indexOf("inventoryNumber") > -1;
  var offerId = Object.keys(model.toJSON()).indexOf("offerId") > -1;
  var updatedAt = Object.keys(model.toJSON()).indexOf("updatedAt") > -1;
  var createdAt = Object.keys(model.toJSON()).indexOf("createdAt") > -1;
  var rejectedAt = Object.keys(model.toJSON()).indexOf("rejectedAt") > -1;
  var receivedAt = Object.keys(model.toJSON()).indexOf("receivedAt") > -1;
  var notes = Object.keys(model.toJSON()).indexOf("notes") > -1;
  var height = Object.keys(model.toJSON()).indexOf("height") > -1;
  var width = Object.keys(model.toJSON()).indexOf("width") > -1;
  var length = Object.keys(model.toJSON()).indexOf("length") > -1;
  var quantity = Object.keys(model.toJSON()).indexOf("quantity") > -1;

  assert.ok(quantity);
  assert.ok(length);
  assert.ok(width);
  assert.ok(height);
  assert.ok(notes);
  assert.ok(receivedAt);
  assert.ok(rejectedAt);
  assert.ok(createdAt);
  assert.ok(updatedAt);
  assert.ok(offerId);
  assert.ok(inventoryNumber);
  assert.ok(grade);
  assert.ok(sentOn);
  assert.ok(designationId);
  assert.ok(favouriteImageId);
  assert.ok(receivedQuantity);
  assert.ok(state);
  assert.ok(state_event);
});

test("Relationships with other models", function(assert) {
  assert.expect(14);

  var pkg = this.store().modelFor("package");
  var relationshipsWithItem = get(pkg, "relationshipsByName").get("item");
  var relationshipsWithPackageType = get(pkg, "relationshipsByName").get(
    "packageType"
  );
  var relationshipsWithDesignation = get(pkg, "relationshipsByName").get(
    "designation"
  );
  var relationshipsWithLocation = get(pkg, "relationshipsByName").get(
    "location"
  );
  var relationshipsWithDonorCondition = get(pkg, "relationshipsByName").get(
    "donorCondition"
  );
  var relationshipsWithOrdersPackages = get(pkg, "relationshipsByName").get(
    "ordersPackages"
  );
  var relationshipsWithPackagesLocation = get(pkg, "relationshipsByName").get(
    "packagesLocations"
  );

  assert.equal(relationshipsWithPackagesLocation.key, "packagesLocations");
  assert.equal(relationshipsWithPackagesLocation.kind, "hasMany");

  assert.equal(relationshipsWithOrdersPackages.key, "ordersPackages");
  assert.equal(relationshipsWithOrdersPackages.kind, "hasMany");

  assert.equal(relationshipsWithDonorCondition.key, "donorCondition");
  assert.equal(relationshipsWithDonorCondition.kind, "belongsTo");

  assert.equal(relationshipsWithLocation.key, "location");
  assert.equal(relationshipsWithLocation.kind, "belongsTo");

  assert.equal(relationshipsWithDesignation.key, "designation");
  assert.equal(relationshipsWithDesignation.kind, "belongsTo");

  assert.equal(relationshipsWithPackageType.key, "packageType");
  assert.equal(relationshipsWithPackageType.kind, "belongsTo");

  assert.equal(relationshipsWithItem.key, "item");
  assert.equal(relationshipsWithItem.kind, "belongsTo");
});
