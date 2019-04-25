import $ from "jquery";
import { run } from "@ember/runloop";
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
    run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("expecting, Location can't be blank when location not selected", function(assert) {
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);

  $.mockjax({
    url: "/api/v1/package*",
    type: "GET",
    status: 200,
    responseText: {
      packages: [package1.toJSON({ includeId: true })]
    }
  });

  andThen(function() {
    $(".confirmLink").click();
    andThen(function() {
      assert.equal(
        $(".show-error")
          .text()
          .trim(),
        "Inventory number is invalid.Location can not be blank."
      );
    });
  });
});
