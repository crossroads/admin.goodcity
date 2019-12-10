import { get } from "@ember/object";
import { test, moduleForModel } from "ember-qunit";

moduleForModel("designation", "Designation Model", {
  needs: ["model:orders_package"]
});

test("check attributes", function(assert) {
  assert.expect(8);
  var model = this.subject();
  var detailId = Object.keys(model.toJSON()).indexOf("detailId") > -1;
  var detailType = Object.keys(model.toJSON()).indexOf("detailType") > -1;
  var description = Object.keys(model.toJSON()).indexOf("description") > -1;
  var activity = Object.keys(model.toJSON()).indexOf("activity") > -1;
  var code = Object.keys(model.toJSON()).indexOf("code") > -1;
  var recentlyUsedAt =
    Object.keys(model.toJSON()).indexOf("recentlyUsedAt") > -1;
  var createdAt = Object.keys(model.toJSON()).indexOf("createdAt") > -1;
  var status = Object.keys(model.toJSON()).indexOf("status") > -1;

  assert.ok(status);
  assert.ok(createdAt);
  assert.ok(recentlyUsedAt);
  assert.ok(code);
  assert.ok(activity);
  assert.ok(description);
  assert.ok(detailType);
  assert.ok(detailId);
});

test("Relationships with other models", function(assert) {
  assert.expect(2);

  var designation = this.store().modelFor("designation");
  var relationshipsWithDistrict = get(designation, "relationshipsByName").get(
    "ordersPackages"
  );

  assert.equal(relationshipsWithDistrict.key, "ordersPackages");
  assert.equal(relationshipsWithDistrict.kind, "hasMany");
});
