/* eslint-disable no-console */
import { run } from "@ember/runloop";
import { test, moduleForModel, skip } from "ember-qunit";
import FactoryGuy from "ember-data-factory-guy";
import testSkip from "../../helpers/test-skip";

moduleForModel("offer", "Offer Model", {
  needs: [
    "model:item",
    "model:message",
    "model:package",
    "model:image",
    "model:donor_condition",
    "model:delivery",
    "model:user",
    "model:schedule",
    "model:rejection_reason",
    "model:contact",
    "model:permission",
    "model:gogovan_transport",
    "model:crossroads_transport",
    "model:package_type",
    "model:gogovan_order",
    "model:address",
    "model:cancellation_reason",
    "service:i18n",
    "service:cloudinaryUtils"
  ]
});

test("offer is a valid ember-data Model", function(assert) {
  assert.expect(1);

  var store = this.store();
  var record = null;

  run(function() {
    store.createRecord("offer", {
      id: 1,
      collectionContactName: "Test"
    });
    record = store.peekRecord("offer", 1);
  });

  assert.equal(record.get("collectionContactName"), "Test");
});

skip("Count of items within an offer", function(assert) {
  assert.expect(1);

  var store = this.store();

  run(function() {
    var item1 = FactoryGuy.make("item", {
      state: "draft"
    });
    var item2 = FactoryGuy.make("item", {
      state: "draft"
    });
    var offer = FactoryGuy.make("offer", {
      items: [item1.id, item2.id]
    });

    return store.peekRecord("offer", offer.id).then(function(offer1) {
      offer1.get("items").then(function() {
        console.log(offer1.get("itemCount"));
        assert.equal(offer1.get("itemCount"), 2);
      });
    });
  });
});
