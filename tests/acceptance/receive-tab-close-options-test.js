import $ from "jquery";
import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import "../factories/orders_package";
import "../factories/packages_location";
import { module, test } from "qunit";
import "../factories/offer";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import "../factories/role";

var App, ofr1, item, pkg1, pkg2, pkg3, order_pkg, packages_location, role;

module("Received Tab close options", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    item = FactoryGuy.make("item", {
      state: "accepted"
    });
    ofr1 = FactoryGuy.make("offer", {
      state: "received",
      items: [item]
    });
    packages_location = FactoryGuy.make("packages_location");
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
    order_pkg = FactoryGuy.make("orders_package", {
      id: 500,
      state: "designated",
      quantity: 6
    });
    pkg1 = FactoryGuy.make("package", {
      offerId: parseInt(ofr1.id),
      state: "expecting",
      item: item
    });
    pkg2 = FactoryGuy.make("package", {
      offerId: parseInt(ofr1.id),
      state: "expecting",
      item: item
    });
    pkg3 = FactoryGuy.make("package", {
      offerId: parseInt(ofr1.id),
      state: "expecting",
      item: item
    });
  },
  afterEach: function() {
    run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("Clicking on receive item options closes other receive-options if already open", function(assert) {
  assert.expect(2);
  visit("/offers/" + ofr1.id + "/review_offer/receive");
  $.mockjax({
    url: "/api/v1/packages_location*",
    type: "GET",
    status: 200,
    responseText: {
      packages_locations: [
        packages_location.toJSON({
          includeId: true
        })
      ]
    }
  });
  $.mockjax({
    url: "/api/v1/orders_package*",
    type: "GET",
    status: 200,
    responseText: {
      orders_packages: [
        order_pkg.toJSON({
          includeId: true
        })
      ]
    }
  });

  andThen(function() {
    //clicking on item options of first package
    $(".options-link-open." + pkg1.id).click();
    assert.equal($(".receive-options").not(".hidden").length, 1);
    //clicking on item optins of second package
    $(".options-link-open." + pkg2.id).click();
    //checking if item option is closed for first package
    assert.equal($(".receive-options .hidden").length, 0);
  });
});

test("Clicking on other item detail closes item options", function(assert) {
  assert.expect(2);
  visit("/offers/" + ofr1.id + "/review_offer/receive");
  $.mockjax({
    url: "/api/v1/packages_location*",
    type: "GET",
    status: 200,
    responseText: {
      packages_locations: [
        packages_location.toJSON({
          includeId: true
        })
      ]
    }
  });
  $.mockjax({
    url: "/api/v1/orders_package*",
    type: "GET",
    status: 200,
    responseText: {
      orders_packages: [
        order_pkg.toJSON({
          includeId: true
        })
      ]
    }
  });

  andThen(function() {
    //clicking on item options of first package
    $(".options-link-open." + pkg1.id).click();
    assert.equal($(".receive-options").not(".hidden").length, 1);
    //clicking on item status of second package
    $(".package-expecting:first div div").click();
    //checking if item option is closed for first package
    assert.equal($(".receive-options").not(".hidden").length, 0);
  });
});
