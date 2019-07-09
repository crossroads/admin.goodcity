import Ember from "ember";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/role";
import "../factories/user";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";

var App, reviewer1, role, mocks;

const times = n => ({
  do(func) {
    for (let i = 0; i < n; ++i) {
      func();
    }
  }
});

function makeOffer(state) {
  FactoryGuy.make("offer_with_items", { state, reviewed_by: reviewer1 });
}

module("App Menu", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    mocks = [];

    role = FactoryGuy.make("role");
    mocks.push(
      $.mockjax({
        url: "/api/v1/role*",
        type: "GET",
        status: 200,
        responseText: {
          roles: [role.toJSON({ includeId: true })]
        }
      })
    );

    reviewer1 = FactoryGuy.make("user", { isReviwer: true });
    window.localStorage.currentUserId = reviewer1.id;

    mocks.push(
      $.mockjax({
        url: "/api/v1/auth/current_user_profil*",
        responseText: {
          user_profile: reviewer1.toJSON({ includeId: true })
        }
      })
    );

    makeOffer("under_review");
    makeOffer("is_reviewed");
    times(3).do(() => makeOffer("scheduled"));
    times(4).do(() => makeOffer("receiving"));
  },
  afterEach: function() {
    mocks.forEach($.mockjax.clear);
    Em.run(function() {
      TestHelper.teardown();
    });
    Ember.run(App, "destroy");
  }
});

test("In progress tab count", function(assert) {
  assert.expect(2);
  visit("/offers/in_progress/reviewing");

  andThen(function() {
    assert.equal(currentURL(), "/offers/in_progress/reviewing");
    assert.equal(
      find('a[href="/offers/in_progress"]').text(),
      "In Progress (2)"
    );
  });
});

test("Scheduled tab count", function(assert) {
  assert.expect(2);
  visit("/offers/in_progress/reviewing");

  andThen(function() {
    assert.equal(currentURL(), "/offers/in_progress/reviewing");
    assert.equal(find('a[href="/offers/scheduled"]').text(), "Scheduled (3)");
  });
});

test("Receiving tab count", function(assert) {
  assert.expect(2);
  visit("/offers/in_progress/reviewing");

  andThen(function() {
    assert.equal(currentURL(), "/offers/in_progress/reviewing");
    assert.equal(find('a[href="/offers/receiving"]').text(), "Receiving (4)");
  });
});

test("Creating an offer", function(assert) {
  assert.expect(7);

  let postRequestSent = false;

  visit("/offers/in_progress/reviewing");

  mocks.push(
    $.mockjax({
      url: "/api/v1/offer*",
      type: "POST",
      status: 200,
      onAfterComplete: () => {
        postRequestSent = true;
      },
      response(req) {
        const dataSent = JSON.parse(req.data).offer;
        assert.equal(dataSent.language, "en");
        assert.equal(dataSent.created_by_id, null);
        assert.equal(dataSent.submitted_at, null);
        assert.equal(dataSent.state, "under_review");
        assert.equal(dataSent.reviewed_by_id, reviewer1.get("id"));
        dataSent.id = "789";
        this.responseText = {
          offer: dataSent
        };
      }
    })
  );

  andThen(function() {
    assert.equal(currentURL(), "/offers/in_progress/reviewing");
    click($("aside.left-off-canvas-menu .create-offer-btn"));
  });

  andThen(function() {
    assert.equal(postRequestSent, true);
  });
});
