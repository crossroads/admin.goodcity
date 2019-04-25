import { run } from "@ember/runloop";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";
import "../factories/offer";
import "../factories/item";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import $ from "jquery";

var App, offer, item, role;

module("Closed Offer", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    offer = FactoryGuy.make("offer", {
      state: "closed"
    });
    item = FactoryGuy.make("item", {
      state: "rejected",
      offer: offer
    });
    role = FactoryGuy.make("role");
    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [
          role.toJSON({
            includeId: true
          })
        ]
      }
    });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("display closed offer with rejected items", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/review_offer/items");
    assert.equal(find(".reject_badge").length, 1);
  });
});

test("display logistics tab of closed offer", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/review_offer/logistics");

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_offer/logistics"
    );

    var logistics_text = $.trim(
      $(".noTransportItems")
        .text()
        .replace(/\s+/g, " ")
    );
    assert.equal(
      logistics_text,
      "No items to transport. This offer is closed now."
    );
  });
});
