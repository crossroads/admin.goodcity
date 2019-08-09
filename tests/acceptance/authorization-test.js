import Ember from "ember";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";

var App, role;

module("Authorization", {
  beforeEach: function() {
    App = startApp({}, 1);
    role = FactoryGuy.make("role");
    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [role.toJSON({ includeId: true })]
      }
    });
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

test("On restricted page doesn't redirect if staff", function(assert) {
  assert.expect(1);
  visit("/offers");

  andThen(function() {
    assert.equal(currentURL(), "/offers");
  });
});
