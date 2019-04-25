import { get } from "@ember/object";
import { test, moduleForModel } from "ember-qunit";

moduleForModel("orders_package", "OrdersPackage Model", {
  needs: ["model:designation", "model:package"]
});

test("check attributes", function(assert) {
  assert.expect(7);
  var model = this.subject();
  var state = Object.keys(model.toJSON()).indexOf("state") > -1;
  var sentOn = Object.keys(model.toJSON()).indexOf("sentOn") > -1;
  var quantity = Object.keys(model.toJSON()).indexOf("quantity") > -1;
  var designationId = Object.keys(model.toJSON()).indexOf("designationId") > -1;
  var itemId = Object.keys(model.toJSON()).indexOf("itemId") > -1;
  var order_id = Object.keys(model.toJSON()).indexOf("order_id") > -1;
  var packageId = Object.keys(model.toJSON()).indexOf("packageId") > -1;

  assert.ok(packageId);
  assert.ok(order_id);
  assert.ok(itemId);
  assert.ok(designationId);
  assert.ok(quantity);
  assert.ok(sentOn);
  assert.ok(state);
});

test("Relationships with other models", function(assert) {
  assert.expect(4);

  var orders_package = this.store().modelFor("orders_package");
  var relationshipsWithPackage = get(orders_package, "relationshipsByName").get(
    "package"
  );
  var relationshipsWithDesignation = get(
    orders_package,
    "relationshipsByName"
  ).get("designation");

  assert.equal(relationshipsWithDesignation.key, "designation");
  assert.equal(relationshipsWithDesignation.kind, "belongsTo");

  assert.equal(relationshipsWithPackage.key, "package");
  assert.equal(relationshipsWithPackage.kind, "belongsTo");
});
