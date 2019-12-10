import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/item";
import "../factories/role";

var App, offer1, offer2, item2, item1, item3, item4, offer3, item5, role;

module("Reviewer: Display Item Status", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    role = FactoryGuy.make("role");
    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [role.toJSON({ includeId: true })]
      }
    });

    offer1 = FactoryGuy.make("offer", { state: "submitted" });
    item1 = FactoryGuy.make("item", { offer: offer1, state: "submitted" });

    offer2 = FactoryGuy.make("offer", { state: "under_review" });
    item2 = FactoryGuy.make("item", { offer: offer2, state: "submitted" });
    item3 = FactoryGuy.make("item", { offer: offer2, state: "accepted" });
    item4 = FactoryGuy.make("item", { offer: offer2, state: "rejected" });

    offer3 = FactoryGuy.make("offer", { state: "cancelled" });
    item5 = FactoryGuy.make("item", { offer: offer3, state: "accepted" });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("Display item status for submitted item", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer1.id + "/review_item/" + item1.id + "/accept");

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer1.id + "/review_item/" + item1.id + "/accept"
    );
    assert.equal(
      $.trim(find(".status-message").text()),
      "This item is awaiting review."
    );
  });
});

test("Display item status for under review item", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer2.id + "/review_item/" + item2.id + "/accept");

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer2.id + "/review_item/" + item2.id + "/accept"
    );
    assert.equal(
      $.trim(find(".status-message").text()),
      "This item is being reviewed."
    );
  });
});

test("Display item status for accepted item", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer2.id + "/review_item/" + item3.id + "/accept");

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer2.id + "/review_item/" + item3.id + "/accept"
    );
    assert.equal(
      $.trim(find(".status-message").text()),
      "This item has been accepted."
    );
  });
});

test("Display offer status for reviewed offer", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer2.id + "/review_item/" + item4.id + "/reject");

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer2.id + "/review_item/" + item4.id + "/reject"
    );
    assert.equal(
      $.trim(find(".status-message").text()),
      "This item has been rejected."
    );
  });
});

test("Display offer status for reviewed offer", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer3.id + "/review_item/" + item5.id + "/accept");

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer3.id + "/review_item/" + item5.id + "/accept"
    );

    var donor_name =
      offer3.get("createdBy.firstName") +
      " " +
      offer3.get("createdBy.lastName");

    assert.equal(
      $(".status-message")
        .text()
        .trim()
        .indexOf(
          "The offer this item belongs to has been cancelled by " +
            donor_name +
            " on"
        ) >= 0,
      true
    );
  });
});
