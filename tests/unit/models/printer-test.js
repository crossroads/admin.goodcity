import { moduleForModel, test } from "ember-qunit";

moduleForModel("printer", "Unit | Model | printer", {
  // Specify the other units that are required for this test.
  needs: ["model:user", "model:printers-user"]
});

test("it exists", function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
