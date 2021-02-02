import Ember from "ember";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/role";
import "../factories/item";
import "../factories/package";
import FactoryGuy from "ember-data-factory-guy";

var App,
  role,
  offer,
  item,
  packageType,
  package1,
  package2,
  orders_pkg1,
  packages_location;

module("Display review Item", {
  beforeEach: function() {
    App = startApp({}, 2);
    role = FactoryGuy.make("role");
    offer = FactoryGuy.make("offer", { state: "under_review" });
    item = FactoryGuy.make("item_with_type", {
      offer: offer,
      state: "accepted"
    });
    packageType = FactoryGuy.make("package_type", { visibleInSelects: true });
    package1 = FactoryGuy.make("package", {
      item: item,
      packageType: packageType
    });
    package2 = FactoryGuy.make("package", {
      item: item,
      packageType: packageType,
      notes: "new edited"
    });
    orders_pkg1 = FactoryGuy.make("orders_package", {
      id: 500,
      state: "designated",
      quantity: 6
    });
    packages_location = FactoryGuy.make("packages_location");
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
      url: "/api/v1/packages_location*",
      type: "GET",
      status: 200,
      responseText: {
        packages_locations: [packages_location.toJSON({ includeId: true })]
      }
    });
    $.mockjax({
      url: "/api/v1/orders_package*",
      type: "GET",
      status: 200,
      responseText: {
        orders_packages: [orders_pkg1.toJSON({ includeId: true })]
      }
    });
    $.mockjax({
      url: "/api/v1/package_type*",
      type: "GET",
      status: 200,
      responseText: {
        package_types: [packageType.toJSON({ includeId: true })]
      }
    });
    $.mockjax({
      url: "/api/v1/package*",
      type: "PUT",
      status: 200,
      responseText: {
        packages: [package2.toJSON({ includeId: true })],
        items: [item.toJSON({ includeId: true })],
        offers: [offer.toJSON({ includeId: true })]
      }
    });
    $.mockjax({
      url: "/api/v1/item*",
      type: "PUT",
      status: 200,
      responseText: {
        items: [item.toJSON({ includeId: true })],
        packages: [package2.toJSON({ includeId: true })],
        offers: [offer.toJSON({ includeId: true })]
      }
    });
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

test("Display Item under review", function(assert) {
  assert.expect(6);

  andThen(() => visit("/offers/1/review_item/4"));

  andThen(function() {
    assert.equal(currentURL(), "/offers/1/review_item/4/accept");
    assert.equal(/Review Item:/i.test($("body").text()), true);
    assert.equal(
      /Velit fugit amet quos ut minima quis/i.test($("body").text()),
      true
    );
    assert.equal(/Condition: New/i.test($("body").text()), true);
    assert.equal($(".item_lable_input input").val(), "");
    assert.equal(find("img.thumb").length, 1);
  });
});

test("Back button redirects to review offer page", function(assert) {
  assert.expect(1);

  const itemId = item.get("id");
  const offerId = item.get("offer.id");

  visit(`/offers/${offerId}/review_item/${itemId}`);
  andThen(function() {
    click("#backToItem");
  });
  andThen(function() {
    assert.equal(currentURL(), `/offers/${offerId}/review_offer/items`);
  });
});

test("Assign description same as the assigned Package Name for the first time", function(assert) {
  assert.expect(4);
  visit("/offers/" + offer.id + "/review_item/" + item.id + "/accept");

  andThen(function() {
    Ember.$(".search_label_input").click();
  });

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/item/" + item.id + "/search_label"
    );
    $("ul.list li:first").click();
  });

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item.id + "/accept"
    );
    assert.equal($(".search_label_input input").val(), packageType.get("name"));
    assert.equal($("#comment0").val(), package1.get("notes"));
  });
});

test("Should save edited description", function(assert) {
  assert.expect(4);
  visit("/offers/" + offer.id + "/review_item/" + item.id + "/accept");

  andThen(function() {
    Ember.$(".search_label_input").click();
  });

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/item/" + item.id + "/search_label"
    );
    $("ul.list li:first").click();
  });

  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item.id + "/accept"
    );
    $("#comment0").val("new edited");
    $("#acceptItem").click();
  });

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/review_offer/items");
    visit("/offers/" + offer.id + "/review_item/" + item.id + "/accept");
  });

  andThen(function() {
    assert.equal($("#comment0").val(), "new edited");
  });
});
