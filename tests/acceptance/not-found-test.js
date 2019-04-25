import $ from "jquery";
import { later, run } from "@ember/runloop";
import { module, test } from "qunit";
import "../factories/offer";
import startApp from "../helpers/start-app";
import testSkip from "../helpers/test-skip";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";

var App, offer, t, role;

module("Display not found error", {
  beforeEach: function() {
    App = startApp();
    later = () => true;
    offer = FactoryGuy.make("offer");
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
    App.__container__.lookup("service:logger").error = () => {};
  },
  afterEach: function() {
    run(App, "destroy");
  }
});

// Test cases with responses as error-statuscodes fails
// https://github.com/emberjs/ember.js/issues/12791

testSkip("Display error popup for invalid offer", function(assert) {
  assert.expect(1);
  $(".reveal-modal").remove();
  visit("/offers/invalid/review_offer/items");

  andThen(function() {
    assert.equal($("#messageBoxText").text(), t("404_error").toString());
    $("#errorModal").foundation("reveal", "close");
  });
});

testSkip("Display error popup for invalid item", function(assert) {
  assert.expect(1);
  $(".reveal-modal").remove();
  visit("/offers/" + offer.id + "/review_item/invalid/accept");
  $.mockjax({
    url: "/api/v1/items/*",
    status: 404
  });

  andThen(function() {
    assert.equal($("#messageBoxText").text(), t("404_error").toString());
    $("#errorModal").foundation("reveal", "close");
  });
});

test("Display not-found page for invalid url", function(assert) {
  assert.expect(2);
  $(".reveal-modal").remove();
  visit("/invalid_url");
  andThen(function() {
    assert.equal(currentURL(), "/invalid_url");
    assert.notEqual(
      $(".xy-center")
        .text()
        .indexOf(t("not_found")),
      -1,
      "not found message found"
    );
  });
});
