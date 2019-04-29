import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/item";
import "../factories/role";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import "../helpers/custom-helpers";
import $ from "jquery";

var App, role;

module("Finished Offers", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    role = FactoryGuy.make("role");
    // reviewer = FactoryGuy.make("user", {
    //   id: 3
    // });
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

    // offer1 = FactoryGuy.make("offer", {
    //   state: "closed",
    //   reviewedBy: reviewer
    // });
    // item1 = FactoryGuy.make("item", {
    //   state: "rejected",
    //   offer: offer1
    // });

    // offer2 = FactoryGuy.make("offer", {
    //   state: "received",
    //   reviewedBy: reviewer
    // });
  },
  afterEach: function() {
    run(App, "destroy");
  }
});

test("redirect to finished offers page", function(assert) {
  assert.expect(5);
  visit("/offers/finished");

  andThen(function() {
    var assertions = function() {
      assert.equal(currentURL(), "/offers/finished/received");
      assert.equal(find("ul.list li").length, 2);
      assert.equal(find("ul.list img").length, 1);

      // under-review status
      assert.equal(
        $(".time_indicator")
          .text()
          .indexOf("Received by ") > 0,
        true
      );
      var itemStatus = $("li.inbox_page:first span.info div:last")
        .text()
        .replace(/\s{1,}/g, " ");

      // items accept-reject status
      assert.equal(itemStatus, " 0 Received, 0 missing, 0 rejected ");
    };

    run(assertions);
  });
});

test("redirect to cancelled offers page", function(assert) {
  assert.expect(5);
  visit("/offers/finished/cancelled");

  andThen(function() {
    assert.equal(currentURL(), "/offers/finished/cancelled");
    assert.equal(find("ul.list li").length, 2);
    assert.equal(find("ul.list img").length, 1);

    // cancelled status
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Closed") > 0,
      true
    );

    // items accept-reject status
    var itemStatus = $("li.inbox_page:first span.info div:last")
      .text()
      .replace(/\s{1,}/g, " ");
    assert.equal(itemStatus, " 0 Accepted, 1 rejected, 0 pending ");
  });
});
