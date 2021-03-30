import Ember from "ember";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";
import "../factories/offer";
import "../factories/item";
import "../factories/role";
import "../factories/printer";
import "../factories/package";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

var App,
  offer,
  item1,
  item2,
  package1,
  package2,
  item3,
  package3,
  item4,
  package4,
  role,
  printer,
  condition1,
  condition2,
  condition3,
  condition4;

module("Reviewer: Accept Item Tab", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    role = FactoryGuy.make("role");
    condition1 = FactoryGuy.make("donor_condition", { visibleToDonor: true });
    condition2 = FactoryGuy.make("donor_condition", { visibleToDonor: true });
    condition3 = FactoryGuy.make("donor_condition", { visibleToDonor: true });
    condition4 = FactoryGuy.make("donor_condition", { visibleToDonor: true });
    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [role.toJSON({ includeId: true })]
      }
    });
    $.mockjax({
      url: "/api/v1/canned*",
      type: "GET",
      status: 200,
      responseText: {
        canned_responses: []
      }
    });

    $.mockjax({
      url: "/api/v1/donor_condition*",
      type: "GET",
      status: 200,
      responseText: {
        donor_conditions: [condition1, condition2, condition3, condition4].map(
          m => m.toJSON({ includeId: true })
        )
      }
    });

    offer = FactoryGuy.make("offer", { state: "under_review" });
    item1 = FactoryGuy.make("item_with_type", {
      offer: offer,
      state: "accepted"
    });
    package1 = FactoryGuy.make("package", {
      item: item1,
      packageType: item1.get("packageType")
    });
    package2 = FactoryGuy.make("package", {
      item: item1,
      packageType: item1.get("packageType")
    });

    item2 = FactoryGuy.make("item", { offer: offer });

    item3 = FactoryGuy.make("item_with_type", {
      offer: offer,
      donorDescription: null,
      donorCondition: null
    });
    package3 = FactoryGuy.make("package", {
      item: item3,
      packageType: item3.get("packageType")
    });

    item4 = FactoryGuy.make("item_with_type", {
      offer: offer,
      state: "rejected",
      rejectionReason: FactoryGuy.make("rejection_reason")
    });
    package4 = FactoryGuy.make("package", {
      item: item4,
      packageType: item4.get("packageType")
    });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    Ember.run(App, "destroy");
  }
});

test("visit rejected item with item_type", function(assert) {
  assert.expect(4);
  visit("/offers/" + offer.id + "/review_item/" + item4.id + "/accept");
  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item4.id + "/accept"
    );
    assert.equal(
      $(".item_lable_input input").val(),
      item4.get("packageType.name")
    );

    // one package components
    assert.equal($(".detail_container").length, 1);

    // Display buttons
    assert.equal($(".accept_buttons button").length, 2);
  });
});

test("visit rejected item page", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer.id + "/review_item/" + item4.id + "/reject");
  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item4.id + "/reject"
    );
    assert.equal(
      $(".item_lable_input input").val(),
      item4.get("packageType.name")
    );

    // hide item-edit link
    assert.equal($(".edit-item-link").length, 0);
  });
});
