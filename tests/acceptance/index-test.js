import { run } from "@ember/runloop";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";

var App, role;

module("Home Page", {
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
    run(App, "destroy");
  }
});

test("redirect to offers page if logged-in as Reviewer", function(assert) {
  assert.expect(1);
  App = startApp({}, 1);
  visit("/");

  andThen(function() {
    assert.equal(currentURL(), "/offers/my_list/reviewing");
  });
});

test("redirect to offers page if logged-in as Supervisor", function(assert) {
  assert.expect(1);
  App = startApp({}, 2);
  visit("/");

  andThen(function() {
    assert.equal(currentURL(), "/offers/submitted");
  });
});

test("redirect to login page if try to visit home page", function(assert) {
  assert.expect(1);
  App = startApp();
  lookup("service:session").set("authToken", null);

  visit("/");

  andThen(function() {
    assert.equal(currentURL(), "/login");
  });
});
