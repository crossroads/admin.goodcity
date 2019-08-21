import Ember from "ember";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/offer";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

var App, offer1, item1, package1, role;

module("Receive package", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    item1 = FactoryGuy.make("item", { state: "accepted" });
    offer1 = FactoryGuy.make("offer", { state: "received", items: [item1] });
    package1 = FactoryGuy.make("package", {
      offerId: parseInt(offer1.id),
      state: "received",
      item: item1
    });

    role = FactoryGuy.make("role");

    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [role.toJSON({ includeId: true })]
      }
    });
  },
  afterEach: function() {
    Ember.run(function() {
      TestHelper.teardown();
    });
    Ember.run(App, "destroy");
  }
});

test("If location not selected button is disabled", function(assert) {
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);

  $.mockjax({
    url: "/api/v1/package*",
    type: "GET",
    status: 200,
    responseText: {
      packages: [package1.toJSON({ includeId: true })]
    }
  });

  $.mockjax({
    url: "api/v1/inventory_num*",
    type: "POST",
    status: 200,
    responseText: {
      inventory_number: "002843"
    }
  });

  andThen(function() {
    assert.equal($("#receive-button").prop("disabled"), true);
  });
});
