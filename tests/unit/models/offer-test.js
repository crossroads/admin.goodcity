import { test, moduleForModel } from "ember-qunit";
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
    "service:cloudinaryUtils",
    "model:printer",
    "model:company"
  ]
});

test("offer is a valid ember-data Model", function() {
  expect(1);

  var store = this.store();
  var record = null;

  Ember.run(function() {
    store.createRecord("offer", { id: 1, collectionContactName: "Test" });
    record = store.peekRecord("offer", 1);
  });

  equal(record.get("collectionContactName"), "Test");
});

testSkip("Count of items within an offer", function() {
  expect(1);

  var store = this.store();

  Ember.run(function() {
    var item1 = FactoryGuy.make("item", { state: "draft" });
    var item2 = FactoryGuy.make("item", { state: "draft" });
    var offer = FactoryGuy.make("offer", { items: [item1.id, item2.id] });

    return store.find("offer", offer.id).then(function(offer1) {
      offer1.get("items").then(function() {
        console.log(offer1.get("itemCount"));
        equal(offer1.get("itemCount"), 2);
      });
    });
  });
});
