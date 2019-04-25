import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import "../factories/orders_package";
import "../factories/packages_location";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/role";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import $ from "jquery";

var App,
  offer1,
  item1,
  package1,
  package2,
  package3,
  orders_pkg1,
  packages_location,
  role;

module("Received Offers", {
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
    item1 = FactoryGuy.make("item", {
      state: "accepted"
    });
    offer1 = FactoryGuy.make("offer", {
      state: "received",
      items: [item1]
    });
    packages_location = FactoryGuy.make("packages_location");
    orders_pkg1 = FactoryGuy.make("orders_package", {
      id: 500,
      state: "designated",
      quantity: 6
    });
    package1 = FactoryGuy.make("package", {
      offerId: parseInt(offer1.id),
      state: "received",
      item: item1
    });
    package2 = FactoryGuy.make("package", {
      offerId: parseInt(offer1.id),
      state: "expecting",
      item: item1
    });
    package3 = FactoryGuy.make("package", {
      offerId: parseInt(offer1.id),
      state: "missing",
      item: item1
    });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("expecting, received and missing count", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer1.id + "/review_offer/receive");
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
        orders_pkg1.toJSON({
          includeId: true
        })
      ]
    }
  });

  andThen(function() {
    //expecting
    var href = "/offers/" + offer1.id + "/review_offer/receive";
    assert.equal(
      $('a[href="' + href + '"]:last')
        .text()
        .trim(),
      "Expecting(1)"
    );
    //received
    var href1 = href + "?state=received";
    assert.equal(
      $('a[href="' + href1 + '"]:last')
        .text()
        .trim(),
      "Received(1)"
    );
    //missing
    href1 = href + "?state=missing";
    assert.equal(
      $('a[href="' + href1 + '"]')
        .text()
        .trim(),
      "Missing(1)"
    );
  });
});
