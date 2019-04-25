import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import "../helpers/custom-helpers";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/item";
import "../factories/packages_location";
import "../factories/role";

var App,
  offer1,
  reviewer,
  reviewerName,
  offer2,
  item1,
  item2,
  packages_location,
  role;

module("In Review Offers", {
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
    reviewer = FactoryGuy.make("user", { id: 3 });
    offer1 = FactoryGuy.make("offer_with_items", {
      state: "under_review",
      reviewedBy: reviewer
    });
    reviewerName = reviewer.get("firstName") + " " + reviewer.get("lastName");
    packages_location = FactoryGuy.make("packages_location");

    offer2 = FactoryGuy.make("offer", {
      state: "reviewed",
      reviewedBy: reviewer
    });
    item1 = FactoryGuy.make("item", { state: "accepted", offer: offer2 });
    item2 = FactoryGuy.make("item", { state: "rejected", offer: offer2 });
    $.mockjax({
      url: "/api/v1/packages_location*",
      type: "GET",
      status: 200,
      responseText: {
        packages_locations: [packages_location.toJSON({ includeId: true })]
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

test("redirect to reviewing offers page", function(assert) {
  assert.expect(5);
  visit("/offers/in_progress");

  andThen(function() {
    var assertions = function() {
      assert.equal(currentURL(), "/offers/in_progress/reviewing");
      assert.equal(find("ul.list li").length, 2);
      assert.equal(find("ul.list img").length, 2);

      // under-review status
      assert.equal(
        $(".time_indicator")
          .text()
          .indexOf("Started by ") > 0,
        true
      );
      var itemStatus = $("li.inbox_page:first span.info div:last")
        .text()
        .replace(/\s{1,}/g, " ");

      assert.equal(itemStatus, " 0 Accepted, 0 rejected, 2 pending ");
    };

    runloopFix(assertions);
  });
});

test("redirect to reviewed offers page", function(assert) {
  assert.expect(6);
  visit("/offers/in_progress/reviewed");

  andThen(function() {
    var assertions = function() {
      assert.equal(currentURL(), "/offers/in_progress/reviewed");
      assert.equal(find("ul.list li").length, 1);
      assert.equal(find("ul.list img").length, 1);

      // reviewed status
      assert.equal(
        $(".time_indicator")
          .text()
          .indexOf("Reviewed") > 0,
        true
      );
      assert.equal(
        $(".time_indicator")
          .text()
          .indexOf("User to plan transport.") > 0,
        true
      );

      // items accept-reject status
      var itemStatus = $("li.inbox_page:first span.info div:last")
        .text()
        .replace(/\s{1,}/g, " ");
      assert.equal(itemStatus, " 1 Accepted, 1 rejected, 0 pending ");
    };

    runloopFix(assertions);
  });
});
