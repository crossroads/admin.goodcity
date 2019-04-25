import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import "../helpers/custom-helpers";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import $ from "jquery";

var App, role;

module("Submitted Offers", {
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
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("redirect to offers page", function(assert) {
  assert.expect(5);
  visit("/offers");

  andThen(function() {
    var assertions = function() {
      assert.equal(currentURL(), "/offers/submitted");
      assert.equal(find("ul.list li").length, 1);
      assert.equal(find("ul.list img").length, 1);

      // submitted status
      assert.equal(
        $(".time_indicator")
          .text()
          .indexOf("Submitted") > 0,
        true
      );
      var itemStatus = $("li.inbox_page:first span.info div:last")
        .text()
        .replace(/\s{1,}/g, " ");

      // items accept-reject status
      assert.equal(itemStatus, " 0 Accepted, 0 rejected, 1 pending ");
    };

    runloopFix(assertions);
  });
});

test("display submitted offer", function(assert) {
  assert.expect(3);
  visit("/offers");

  andThen(function() {
    var assertions = function() {
      assert.equal(currentURL(), "/offers/submitted");
      click("ul.list li:first a");
      andThen(function() {
        assert.equal(currentURL(), "/offers/3/review_offer/items");
        assert.equal(find("a:contains('Start Review')").length, 1);
      });
    };

    runloopFix(assertions);
  });
});
