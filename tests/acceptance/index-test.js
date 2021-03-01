import Ember from "ember";
import { module, test } from "qunit";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/role";

var App, role, reviewer1, offer1, offer2, item, message1, message2;

module("Home Page", {
  beforeEach: function() {
    App = startApp({}, 1);
    role = FactoryGuy.make("role");
    reviewer1 = FactoryGuy.make("user", { isReviwer: true });
    window.localStorage.currentUserId = reviewer1.id;
    offer1 = FactoryGuy.make("offer", {
      state: "receiving",
      createdBy: reviewer1
    });
    offer2 = FactoryGuy.make("offer", {
      state: "submitted",
      createdBy: reviewer1
    });

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

    item = FactoryGuy.make("item", { state: "submitted", offer: offer1 });
    message2 = FactoryGuy.make("message", {
      offer: offer1,
      itemId: item.id,
      item: item,
      body: "Message from Donor"
    });
    message1 = FactoryGuy.make("message", {
      offer: offer1,
      itemId: item.id,
      item: item
    });

    $.mockjax({
      url: "/api/v1/auth/current_user_profil*",
      responseText: {
        user_profile: reviewer1.toJSON({ includeId: true })
      }
    });

    $.mockjax({
      url: "/api/v1/message*",
      type: "GET",
      status: 200,
      responseText: {
        messages: [message1, message2].map(m => m.toJSON({ includeId: true }))
      }
    });

    $.mockjax({
      url: "/api/v1/offers/sum*",
      type: "GET",
      status: 200,
      responseText: {
        under_review: 14,
        reviewed: 1,
        scheduled: 1,
        receiving: 2,
        priority_under_review: 14,
        priority_receiving: 1,
        priority_scheduled: 2,
        priority_reviewed: 1
      }
    });

    $.mockjax({
      url: "/api/v1/off*",
      type: "GET",
      status: 200,
      responseText: {
        offers: [
          offer1.toJSON({ includeId: true }),
          offer2.toJSON({ includeId: true })
        ]
      }
    });

    $.mockjax({
      url: "/api/v1/offers/search?state='submitted'*",
      type: "GET",
      status: 200,
      responseText: {
        offers: [offer2.toJSON({ includeId: true })]
      }
    });

    visit("/holidays");
  },
  afterEach: function() {
    Ember.run(App, "destroy");
  }
});

test("redirect to dashboard page if logged-in as Reviewer", function(assert) {
  assert.expect(1);
  visit("/");

  andThen(function() {
    assert.equal(currentURL(), "/dashboard");
  });
});

test("redirect to dashboard page if logged-in as Supervisor", function(assert) {
  assert.expect(1);
  visit("/");

  andThen(function() {
    assert.equal(currentURL(), "/dashboard");
  });
});

test("redirect to login page if try to visit home page", function(assert) {
  assert.expect(1);
  Ember.run(function() {
    lookup("service:session").set("authToken", null);
  });
  visit("/");

  andThen(function() {
    assert.equal(currentURL(), "/login");
  });
});
