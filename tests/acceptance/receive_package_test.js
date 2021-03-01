import Ember from "ember";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/offer";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

var App,
  offer1,
  item1,
  package1,
  role,
  location,
  order_pkg,
  packages_location,
  printer,
  reviewer1,
  user;

module("Receive package", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    location = FactoryGuy.make("location");
    user = FactoryGuy.make("user");
    printer = FactoryGuy.make("printer");
    item1 = FactoryGuy.make("item", { state: "accepted" });
    offer1 = FactoryGuy.make("offer", { state: "receiving", items: [item1] });
    package1 = FactoryGuy.make("package", {
      offerId: parseInt(offer1.id),
      state: "expecting",
      item: item1
    });
    role = FactoryGuy.make("role");

    order_pkg = FactoryGuy.make("orders_package", {
      id: 500,
      state: "designated",
      quantity: 6
    });
    packages_location = FactoryGuy.make("packages_location");
    reviewer1 = FactoryGuy.make("user", { isReviewer: true });
    window.localStorage.currentUserId = reviewer1.id;

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
      url: "/api/v1/offer*",
      type: "GET",
      status: 200,
      responseText: {
        offers: [offer1.toJSON({ includeId: true })]
      }
    });

    $.mockjax({
      url: "/api/v1/printer*",
      type: "GET",
      status: 200,
      responseText: {
        printers: [printer.toJSON({ includeId: true })]
      }
    });

    $.mockjax({
      url: "/api/v1/auth/current_user_profil*",
      responseText: {
        user_profile: reviewer1.toJSON({ includeId: true }),
        printers_users: []
      }
    });

    $.mockjax({
      url: "/api/v1/messag*",
      type: "GET",
      status: 200,
      responseText: {
        messages: []
      }
    });

    $.mockjax({
      url: "/api/v1/holiday*",
      type: "GET",
      status: 200,
      responseText: {
        holidays: []
      }
    });

    $.mockjax({
      url: "/api/v1/gogovan_transport*",
      type: "GET",
      status: 200,
      responseText: {
        gogovan_transports: []
      }
    });

    $.mockjax({
      url: "/api/v1/crossroads_transport*",
      type: "GET",
      status: 200,
      responseText: {
        crossroads_transports: []
      }
    });

    $.mockjax({
      url: "/api/v1/cancellation_reason*",
      type: "GET",
      status: 200,
      responseText: {
        cancellation_reasons: []
      }
    });

    $.mockjax({
      url: "/api/v1/rejection_reason*",
      type: "GET",
      status: 200,
      responseText: {
        rejection_reasons: []
      }
    });

    $.mockjax({
      url: "/api/v1/location*",
      type: "GET",
      status: 200,
      responseText: {
        locations: []
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
        orders_packages: [order_pkg.toJSON({ includeId: true })]
      }
    });

    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [role.toJSON({ includeId: true })]
      }
    });

    $.mockjax({
      url: "/api/v1/package*",
      type: "GET",
      status: 200,
      response: function() {
        this.responseText = {
          package: package1.toJSON({ includeId: true })
        };
      }
    });

    $.mockjax({
      url: "/api/v1/user*",
      type: "PUT",
      status: 200,
      responseText: {
        users: [user.toJSON({ includeId: true })]
      }
    });

    $.mockjax({
      url: "api/v1/packages/print_barcode*",
      type: "POST",
      status: 200,
      responseText: {
        inventory_number: "002843"
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

    $.mockjax({
      url: "api/v1/printers*",
      type: "POST",
      status: 200,
      responseText: {
        printers_user: { id: 3, printer_id: 2, user_id: 19, tag: "admin" }
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

test("If location not selected Receive button is disabled", function(assert) {
  Ember.run(function() {
    package1.set("location", null);
    package1.set("locationId", null);
  });
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
  andThen(function() {
    assert.equal($("#receive-button").prop("disabled"), true);
  });
});

test("If quantity is zero or below Receive button is disabled and it gives validation error", function(assert) {
  Ember.run(function() {
    package1.set("receivedQuantity", 0);
  });
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
  andThen(function() {
    assert.equal(
      $("#quantity-err")
        .text()
        .trim(),
      "Quantity cannot be blank or 0."
    );
    assert.equal($("#receive-button").prop("disabled"), true);
  });
});

test("If labels is empty Receive button is disabled and it gives validation error", function(assert) {
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
  andThen(function() {
    Ember.run(function() {
      lookup("controller:receive_package").set("packageForm.labels", "");
    });
    assert.equal(
      $("#label-empty-err")
        .text()
        .trim(),
      "Can't be blank."
    );
    assert.equal($("#receive-button").prop("disabled"), true);
  });
});

test("If labels is above 300 Receive button is disabled and it gives max value error", function(assert) {
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
  andThen(function() {
    Ember.run(function() {
      lookup("controller:receive_package").set("packageForm.labels", 301);
    });
    assert.equal(
      $("#max-val-err")
        .text()
        .trim(),
      "Max 300"
    );
    assert.equal($("#receive-button").prop("disabled"), true);
  });
});

test("Receive button displays print value according to labels count", function(assert) {
  const labelValue = 10;
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
  andThen(function() {
    Ember.run(function() {
      lookup("controller:receive_package").set(
        "packageForm.labels",
        labelValue
      );
    });
    const isValueExist =
      $("#receive-button")
        .text()
        .trim()
        .indexOf(labelValue) > 1;
    assert.equal(isValueExist, true);
  });
});

test("Receive button enables on selecting location", function(assert) {
  Ember.run(function() {
    package1.set("location", location);
  });
  visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
  andThen(function() {
    assert.equal($("#receive-button").prop("disabled"), false);
  });
});

// test("On receiving package redirects to recieve list pages", function(assert) {
//   assert.expect(0);
//   Ember.run(function() {
//     package1.set("location", location);
//   });
//   visit("/offers/" + offer1.id + "/receive_package/" + package1.id);
//   $.mockjax({
//     url: "/api/v1/packages*",
//     type: "PUT",
//     status: 200,
//     responseText: {
//       package: package1.toJSON({ includeId: true })
//     }
//   });
//   $.mockjax({
//     url: "api/v1/packages/print_barcode*",
//     type: "POST",
//     status: 200,
//     responseText: {
//       inventory_number: "002843"
//     }
//   });

//   $.mockjax({
//     url: "/api/v1/user*",
//     type: "PUT",
//     status: 200,
//     responseText: {
//       users: [user.toJSON({ includeId: true })]
//     }
//   });

//   $.mockjax({
//     url: "/api/v1/user*",
//     type: "GET",
//     status: 200,
//     responseText: {
//       users: [user.toJSON({ includeId: true })]
//     }
//   });

//   andThen(function() {
//     click("#receive-button");
//   });

//   andThen(function() {
//     assert.equal(
//       currentURL(),
//       "/offers/" + offer1.id + "/review_offer/receive"
//     );
//   });
// });
