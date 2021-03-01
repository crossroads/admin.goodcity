import Ember from "ember";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import "../factories/user";
import "../factories/offer";
import "../factories/item";
import "../factories/contact";
import "../factories/gogovan_order";
import "../factories/delivery";
import "../factories/address";
import "../factories/role";

var App, offer, user, ggvOrder, delivery, address, contact, item, role;

module("Search Offers", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();

    lookup("service:filter-service").clearFilters();

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

    user = FactoryGuy.make("user", { firstName: "Johnny", mobile: "99999999" });
    offer = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      createdBy: user
    });
    item = FactoryGuy.make("item", { offer: offer, state: "accepted" });

    ggvOrder = FactoryGuy.make("gogovan_active_order");
    contact = FactoryGuy.make("contact");
    delivery = FactoryGuy.make("delivery", {
      gogovanOrder: ggvOrder,
      offer: offer,
      contact: contact
    });
    address = FactoryGuy.make("address", { addressable: contact });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    Ember.run(App, "destroy");
  }
});

test("searching a valid term should display results", function(assert) {
  assert.expect(2);
  visit("/search");

  andThen(function() {
    assert.equal(currentURL(), "/search");
    fillIn("#searchText", "Kendrick");

    andThen(function() {
      assert.equal(find("ul li").length, 8);
    });
  });
});

test("clicking State button redirects to state filters page", function(assert) {
  assert.expect(2);
  visit("/search");

  andThen(function() {
    assert.equal(currentURL(), "/search");
    click("#state-filter-button");
  });

  andThen(function() {
    assert.equal(currentURL(), "/offers_filters?applyStateFilter=true");
  });
});

test("Clicking Due button redirects to time filters page", function(assert) {
  assert.expect(2);
  visit("/search");

  andThen(function() {
    assert.equal(currentURL(), "/search");
    click("#time-filter-button");
  });

  andThen(function() {
    assert.equal(currentURL(), "/offers_filters?applyTimeFilter=true");
  });
});

test("Clicking All button applies Reviewer Filter", function(assert) {
  assert.expect(2);
  visit("/search");

  andThen(function() {
    assert.equal(currentURL(), "/search");
    click("#reviewer-filter-button");
  });

  andThen(function() {
    assert.equal(
      Ember.$("#reviewer-filter-button")
        .text()
        .trim(),
      "Mine"
    );
  });
});

test("Clicking Apply filter button in State filter page redirects to search page", function(assert) {
  assert.expect(2);
  visit("/offers_filters?applyStateFilter=true");
  andThen(function() {
    assert.equal(currentURL(), "/offers_filters?applyStateFilter=true");
    click(".filter-btn.apply");
  });

  andThen(function() {
    assert.equal(currentURL(), "/search");
  });
});

test("Clicking Apply filter button in Due filter page redirects to search page", function(assert) {
  assert.expect(2);
  visit("/offers_filters?applyTimeFilter=true");
  andThen(function() {
    assert.equal(currentURL(), "/offers_filters?applyTimeFilter=true");
    click(".filter-btn.apply");
  });

  andThen(function() {
    assert.equal(currentURL(), "/search");
  });
});

test("Select Time from list apply that time filter on search page", function(assert) {
  assert.expect(3);
  visit("/offers_filters?applyTimeFilter=true");
  andThen(function() {
    assert.equal(currentURL(), "/offers_filters?applyTimeFilter=true");
    click(".overdue");
  });

  andThen(function() {
    click(".filter-btn.apply");
  });

  andThen(function() {
    assert.equal(currentURL(), "/search");
    assert.equal(
      Ember.$("#time-filter-button")
        .text()
        .trim(),
      "Overdue"
    );
  });
});

test("Checking multiple states checkboxes in State filter page applies number of selected states on Offers", function(assert) {
  let noOfSelectedStates = 0;
  assert.expect(3);
  visit("/offers_filters?applyStateFilter=true");
  andThen(function() {
    assert.equal(currentURL(), "/offers_filters?applyStateFilter=true");
    click("#submitted");
    noOfSelectedStates += 1;
    click("#showPriority");
    noOfSelectedStates += 1;
  });

  andThen(function() {
    click(".filter-btn.apply");
  });

  andThen(function() {
    assert.equal(currentURL(), "/search");
    assert.equal(
      Ember.$("#state-filter-button")
        .text()
        .trim(),
      `State: ${noOfSelectedStates}`
    );
  });
});
