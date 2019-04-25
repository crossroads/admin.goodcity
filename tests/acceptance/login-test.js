import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/user_profile";
import "../factories/role";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import $ from "jquery";

var App, hk_user, non_hk_user, role;

module("Acceptance: Login", {
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

    hk_user = FactoryGuy.make("with_hk_mobile");
    non_hk_user = FactoryGuy.make("with_non_hk_mobile");

    lookup("controller:subscriptions").pusher = {
      get: function() {
        return {};
      },
      wire: function() {}
    };
  },
  afterEach: function() {
    run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("User able to enter mobile number and get the sms code", function(assert) {
  assert.expect(1);
  logoutUser("/login");
  fillIn("#mobile", hk_user.get("mobile"));
  triggerEvent("#mobile", "blur");
  click("#getsmscode");

  andThen(function() {
    assert.equal(currentURL(), "/authenticate");
  });
});

test("User is able to enter sms code and confirm and redirected to offers", function(assert) {
  assert.expect(2);

  var authToken = window.localStorage.authToken;
  logoutUser("/authenticate");
  visit("/authenticate");
  fillIn("#pin", "1234");
  triggerEvent("#pin", "blur");

  andThen(function() {
    assert.equal(find("#pin").val().length, 4);
    window.localStorage.authToken = authToken;
  });

  click("#submit_pin");

  andThen(function() {
    assert.equal(currentURL(), "/offers/submitted");
  });
});

test("Logout clears authToken", function(assert) {
  assert.expect(1);

  visit("/offers");
  click("a:contains('Logout')");
  andThen(function() {
    assert.equal(typeof window.localStorage.authToken, "undefined");
  });
});

test("User is able to resend the sms code", function(assert) {
  assert.expect(1);

  $.mockjax({
    url: "/api/v1/auth/send_pi*",
    responseText: {
      otp_auth_key: "/JqONEgEjrZefDV3ZIQsNA=="
    }
  });

  logoutUser("/authenticate");
  visit("/authenticate");

  click("#resend-pin");

  andThen(function() {
    assert.equal(window.localStorage.otpAuthKey, '"/JqONEgEjrZefDV3ZIQsNA=="');
  });
});
