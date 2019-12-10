import { run } from "@ember/runloop";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";
import "../factories/offer";
import "../factories/item";
import "../factories/role";
import "../factories/package";
import "../factories/rejection_reason";
import "../factories/message";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

let App,
  t,
  offer,
  item1,
  package1,
  role,
  rejectionReason1,
  orders_pkg1,
  packages_location,
  message1;

module("Reviewer: Reject Item Tab", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    var i18n = App.__container__.lookup("service:i18n");
    t = i18n.t.bind(i18n);
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

    offer = FactoryGuy.make("offer", {
      state: "under_review"
    });

    item1 = FactoryGuy.make("item_with_type", {
      offer: offer,
      donorDescription: null,
      donorCondition: null
    });

    package1 = FactoryGuy.make("package", {
      item: item1,
      packageType: item1.get("packageType")
    });

    rejectionReason1 = FactoryGuy.make("rejection_reason");

    orders_pkg1 = FactoryGuy.make("orders_package", {
      id: 500,
      state: "designated",
      quantity: 6
    });
    packages_location = FactoryGuy.make("packages_location");

    message1 = FactoryGuy.make("message", {
      body: t("reject.reject_message") + t("reject.quality_message"),
      item: item1
    });

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

    $.mockjax({
      url: "/api/v1/item*",
      type: "PUT",
      status: 200,
      responseText: {
        item: [
          item1.toJSON({
            includeId: true
          })
        ],
        package: [
          package1.toJSON({
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

test("visit reject item tab without item_type", function(assert) {
  assert.expect(3);
  console.log(rejectionReason1.id);
  visit("/offers/" + offer.id + "/review_item/" + item1.id + "/reject");
  andThen(function() {
    click($("li label:contains('Quality')"));
    andThen(function() {
      assert.equal(
        $("#rejectMessage").val(),
        t("reject.reject_message") + t("reject.quality_message")
      );
      run(function() {
        click($("button.rejectOffer"));
      });
      andThen(function() {
        assert.equal(
          currentURL(),
          "/offers/" + offer.id + "/review_offer/items"
        );
        assert.equal(
          $(".list-offer-items li:first-child .message-text")
            .text()
            .trim(),
          t("reject.reject_message") + t("reject.quality_message")
        );
      });
    });
  });
});
