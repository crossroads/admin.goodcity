import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import "../helpers/custom-helpers";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";

var App, user, role, userRole, userRole1, mocks;

module("Users", {
  beforeEach: function() {
    App = startApp({}, 1);
    TestHelper.setup();

    role = FactoryGuy.make("role");
    user = FactoryGuy.make("user");
    userRole = FactoryGuy.make("user_role");
    userRole1 = FactoryGuy.make("user_role");

    mocks = [
      $.mockjax({
        url: "/api/v1/role*",
        type: "GET",
        status: 200,
        responseText: {
          roles: [role.toJSON({ includeId: true })]
        }
      }),

      $.mockjax({
        url: "/api/v1/user_role*",
        type: "GET",
        status: 200,
        responseText: {
          user_roles: [
            userRole.toJSON({ includeId: true }),
            userRole1.toJSON({ includeId: true })
          ]
        }
      }),

      $.mockjax({
        url: `/api/v1/user/${user.get("id")}`,
        type: "GET",
        status: 200,
        responseText: {
          user: user.toJSON({ includeId: true })
        }
      }),

      $.mockjax({
        url: "/api/v1/user*",
        type: "GET",
        status: 200,
        responseText: {
          users: [user.toJSON({ includeId: true })]
        }
      }),

      $.mockjax({
        url: "/api/v1/user*",
        type: "PUT",
        status: 200,
        responseText: {
          user: user.toJSON({ includeId: true })
        }
      })
    ];
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
    mocks.forEach($.mockjax.clear);
  }
});

test("redirect to users page after role save", function(assert) {
  assert.expect(3);

  visit("/users");

  andThen(function() {
    fillIn("input#searchText", "some search text");
    andThen(function() {
      assert.equal(currentURL(), "/users");
      click("ul.list li:first a");
      andThen(function() {
        assert.equal(currentURL(), "/users/" + user.id);
        click("button.expand");
        andThen(function() {
          assert.equal(currentURL(), "/users");
        });
      });
    });
  });
});
