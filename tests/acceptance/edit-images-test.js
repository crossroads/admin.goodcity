import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/offer";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import $ from "jquery";

var App, offer, role;

module("Add new Item", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
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
    offer = FactoryGuy.make("offer_with_items", {
      state: "under_review"
    });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("create without Image", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/items/new/edit_images");

  andThen(function() {
    assert.equal($(".noImage a:contains('Cannot provide photo')").length, 1);
    click(find("a:contains('Cannot provide photo')"));
    andThen(function() {
      assert.equal(currentURL(), "/offers/101/review_item/3/accept");
    });
  });
});
