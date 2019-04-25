import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import "../helpers/custom-helpers";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import $ from "jquery";

var App, user, role, userRole, userRole1;

module("Users", {
  beforeEach: function() {
    App = startApp({}, 1);
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

    user = FactoryGuy.make("user");
    $.mockjax({
      url: "/api/v1/users",
      type: "GET",
      status: 200,
      responseText: {
        users: [
          user.toJSON({
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

test("redirect to users page after role save", function(assert) {
  assert.expect(3);
  userRole = FactoryGuy.make("user_role");
  userRole1 = FactoryGuy.make("user_role");
  $.mockjax({
    url: "/api/v1/user_role*",
    type: "GET",
    status: 200,
    responseText: {
      user_roles: [
        userRole.toJSON({
          includeId: true
        }),
        userRole1.toJSON({
          includeId: true
        })
      ]
    }
  });

  $.mockjax({
    url: "/api/v1/user*",
    type: "PUT",
    status: 200,
    responseText: {
      user: [
        user.toJSON({
          includeId: true
        })
      ]
    }
  });

  visit("/users");

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
