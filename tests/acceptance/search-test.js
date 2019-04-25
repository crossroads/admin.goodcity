import { debounce, run } from "@ember/runloop";
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
import $ from "jquery";

var App, offer, user, ggvOrder, delivery, address, contact, item, role;

module("Search Offers", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    debounce = (context, func) => func.call(context);

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

    user = FactoryGuy.make("user", {
      firstName: "Johnny",
      mobile: "99999999"
    });
    offer = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      createdBy: user
    });
    item = FactoryGuy.make("item", {
      offer: offer,
      state: "accepted"
    });

    ggvOrder = FactoryGuy.make("gogovan_active_order");
    contact = FactoryGuy.make("contact");
    delivery = FactoryGuy.make("delivery", {
      gogovanOrder: ggvOrder,
      offer: offer,
      contact: contact
    });
    address = FactoryGuy.make("address", {
      addressable: contact
    });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("searching a valid term should display results", function(assert) {
  assert.expect(2);
  visit("/search");

  andThen(function() {
    assert.equal(currentURL(), "/search");
    fillIn("#searchText", "Kendrick");

    andThen(function() {
      assert.equal(find("ul li").length, 4);
    });
  });
});

test("empty search results should result in a message on the page", function(assert) {
  assert.expect(2);
  visit("/search");

  andThen(function() {
    assert.equal(currentURL(), "/search");
    fillIn("#searchText", "i.dont.exist");

    andThen(function() {
      assert.equal(
        find(".no_result")
          .text()
          .trim(),
        "Sorry, No results found."
      );
    });
  });
});
