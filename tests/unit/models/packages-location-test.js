import { get } from "@ember/object";
import { test, moduleForModel } from "ember-qunit";

moduleForModel("packages_location", "PackagesLocation Model", {
  needs: ["model:location", "model:package"]
});

test("check attributes", function(assert) {
  assert.expect(4);
  var model = this.subject();

  var locationId = Object.keys(model.toJSON()).indexOf("locationId") > -1;
  var quantity = Object.keys(model.toJSON()).indexOf("quantity") > -1;
  var itemId = Object.keys(model.toJSON()).indexOf("itemId") > -1;
  var packageId = Object.keys(model.toJSON()).indexOf("packageId") > -1;

  assert.ok(packageId);
  assert.ok(itemId);
  assert.ok(quantity);
  assert.ok(locationId);
});

test("Relationships with other models", function(assert) {
  assert.expect(4);

  var packages_location = this.store().modelFor("packages_location");
  var relationshipsWithPackage = get(
    packages_location,
    "relationshipsByName"
  ).get("package");
  var relationshipsWithLocation = get(
    packages_location,
    "relationshipsByName"
  ).get("location");

  assert.equal(relationshipsWithLocation.key, "location");
  assert.equal(relationshipsWithLocation.kind, "belongsTo");

  assert.equal(relationshipsWithPackage.key, "package");
  assert.equal(relationshipsWithPackage.kind, "belongsTo");
});
