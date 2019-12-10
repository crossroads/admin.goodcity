import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/offer";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

var App, offer, role, mocks;

module("Add new Item", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    role = FactoryGuy.make("role");
    mocks = [
      $.mockjax({
        url: "/api/v1/role*",
        type: "GET",
        status: 200,
        responseText: {
          roles: [role.toJSON({ includeId: true })]
        }
      })
    ];
    offer = FactoryGuy.make("offer_with_items", { state: "under_review" });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
    mocks.forEach($.mockjax.clear);
  }
});

test("create without Image", function(assert) {
  assert.expect(3);

  let itemPosted = false;
  mocks.push(
    $.mockjax({
      url: "/api/v1/item*",
      type: "POST",
      status: 200,
      response: function(req) {
        const data = JSON.parse(req.data);
        data["item"]["id"] = "3";
        this.responseText = data;
        itemPosted = true;
      }
    })
  );

  visit("/offers/" + offer.id + "/items/new/edit_images");

  andThen(function() {
    assert.equal($(".noImage a:contains('Cannot provide photo')").length, 1);
    click(find("a:contains('Cannot provide photo')"));
    andThen(function() {
      assert.equal(itemPosted, true);
      assert.equal(currentURL(), "/offers/101/review_item/3/accept");
    });
  });
});
