import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import "../helpers/custom-helpers";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/item";
import "../factories/packages_location";
import $ from "jquery";

var App, offer1, reviewer, packages_location, role;

module("In Review Offers", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    reviewer = FactoryGuy.make("user", {
      id: 3
    });
    offer1 = FactoryGuy.make("offer", {
      state: "under_review",
      reviewedBy: reviewer
    });
    packages_location = FactoryGuy.make("packages_location");

    role = FactoryGuy.make("role");
    $.mockjax.clear();
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
  },
  afterEach: function() {
    run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("check offer-messages replace [click_here|transport] to click_here link", function(assert) {
  assert.expect(2);
  var url = "/offers/" + offer1.id + "/supervisor_messages";
  visit(url);

  andThen(function() {
    assert.equal(currentURL(), url);
    andThen(function() {
      fillIn(".message-base textarea", "[click_here|transport_page]");
      andThen(function() {
        click(".message-base button");
        andThen(function() {
          assert.equal(
            $(".my_message")
              .text()
              .trim()
              .split(" ")
              .splice(-1)[0],
            "click_here"
          );
        });
      });
    });
  });
});
