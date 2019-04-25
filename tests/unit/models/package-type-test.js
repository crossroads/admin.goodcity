import { get } from "@ember/object";
import { test, moduleForModel } from "ember-qunit";

moduleForModel("package_type", "PackageType Model", {
  needs: ["model:location", "model:package"]
});

test("check attributes", function(assert) {
  assert.expect(7);
  var model = this.subject();

  var name = Object.keys(model.toJSON()).indexOf("name") > -1;
  var otherTerms = Object.keys(model.toJSON()).indexOf("otherTerms") > -1;
  var code = Object.keys(model.toJSON()).indexOf("code") > -1;
  var isItemTypeNode =
    Object.keys(model.toJSON()).indexOf("isItemTypeNode") > -1;
  var visibleInSelects =
    Object.keys(model.toJSON()).indexOf("visibleInSelects") > -1;
  var defaultChildPackages =
    Object.keys(model.toJSON()).indexOf("defaultChildPackages") > -1;
  var otherChildPackages =
    Object.keys(model.toJSON()).indexOf("otherChildPackages") > -1;

  assert.ok(otherChildPackages);
  assert.ok(defaultChildPackages);
  assert.ok(visibleInSelects);
  assert.ok(isItemTypeNode);
  assert.ok(code);
  assert.ok(otherTerms);
  assert.ok(name);
});

test("Relationships with other models", function(assert) {
  assert.expect(4);

  var package_type = this.store().modelFor("package_type");
  var relationshipsWithPackage = get(package_type, "relationshipsByName").get(
    "packages"
  );
  var relationshipsWithLocation = get(package_type, "relationshipsByName").get(
    "location"
  );

  assert.equal(relationshipsWithLocation.key, "location");
  assert.equal(relationshipsWithLocation.kind, "belongsTo");

  assert.equal(relationshipsWithPackage.key, "packages");
  assert.equal(relationshipsWithPackage.kind, "hasMany");
});
