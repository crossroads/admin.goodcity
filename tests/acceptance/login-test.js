import Ember from "ember";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/user_profile";
import "../factories/role";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

var App, hk_user, non_hk_user, role, offer1, offer2, reviewer1;

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
        roles: [role.toJSON({ includeId: true })]
      }
    });
    $.mockjax({
      url: "/api/v1/canned*",
      type: "GET",
      status: 200,
      responseText: {
        canned_responses: []
      }
    });
    reviewer1 = FactoryGuy.make("user", { isReviwer: true });
    offer1 = FactoryGuy.make("offer", { state: "receiving" });
    offer2 = FactoryGuy.make("offer", { state: "submitted" });

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
    Ember.run(function() {
      TestHelper.teardown();
    });
    Ember.run(App, "destroy");
  }
});

test("User able to enter mobile number and get the sms code", function(assert) {
  assert.expect(2);
  window.localStorage.authToken = "";
  visit("/login");
  andThen(function() {
    assert.equal(currentURL(), "/login");
  });
  fillIn("#mobile", hk_user.get("mobile"));
  triggerEvent("#mobile", "blur");
  click("#getsmscode");

  andThen(function() {
    assert.equal(currentURL(), "/authenticate");
  });
});

// test("User is able to enter sms code and confirm and redirected to dashboard", function(assert) {
//   var authToken = window.localStorage.authToken;
//   // assert.expect(2);
//   window.localStorage.authToken = "";
//   visit('/login');
//   andThen(function() {
//     assert.equal(currentURL(), "/login");
//   });
//   fillIn('#mobile', hk_user.get("mobile"));
//   triggerEvent('#mobile', 'blur');
//   click("#getsmscode");

//   andThen(function() {
//     assert.equal(currentURL(), "/authenticate");
//   });
//   fillIn('#pin', "1234");
//   andThen(function() {
//     assert.equal(find('#pin').val().length, 4);
//     window.localStorage.authToken = authToken;
//   });

//   click("#submit_pin");

//   andThen(function(){
//     assert.equal(currentURL(), "/dashboard");
//   });
// });

test("Logout clears authToken", function(assert) {
  assert.expect(2);

  visit("/holidays");
  andThen(function() {
    assert.equal(currentURL(), "/holidays");
  });
  click("a:contains('Logout')");
  andThen(function() {
    assert.equal(typeof window.localStorage.authToken, "undefined");
  });
});

test("User is able to resend the sms code", function(assert) {
  assert.expect(2);

  $.mockjax({
    url: "/api/v1/auth/send_pi*",
    responseText: {
      otp_auth_key: "/JqONEgEjrZefDV3ZIQsNA=="
    }
  });
  window.localStorage.authToken = "";
  visit("/authenticate");
  andThen(function() {
    assert.equal(currentURL(), "/authenticate");
  });
  click("#resend-pin");

  andThen(function() {
    assert.equal(window.localStorage.otpAuthKey, '"/JqONEgEjrZefDV3ZIQsNA=="');
  });
});
