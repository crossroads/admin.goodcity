import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import "../factories/message";
import "../factories/offer";
import "../factories/item";
import "../factories/schedule";
import "../factories/gogovan_order";
import "../factories/delivery";
import "../factories/role";

var App, offer, item1, item2, item3, message1, message2, donor, msg_time, role;

module("Reviewer: Display Offer Tab", {
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

    offer = FactoryGuy.make("offer", { state: "under_review" });
    msg_time = new Date().setHours(0, 0, 0);
    message1 = FactoryGuy.make("message", {
      sender: donor,
      offer: offer,
      item: null,
      createdAt: msg_time
    });
    item1 = FactoryGuy.make("item", { state: "accepted", offer: offer });
    item2 = FactoryGuy.make("item", { state: "rejected", offer: offer });
    item3 = FactoryGuy.make("item", { state: "submitted", offer: offer });
    message2 = FactoryGuy.make("message", {
      sender: donor,
      offer: offer,
      item: item3
    });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("item status badge on item-image", function(assert) {
  assert.expect();
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/review_offer/items");

    // display 'Accepted' status for accepted-item
    assert.equal($(".item-image .accept_badge").not(".hidden").length, 1);

    // display 'Rejected' status for accepted-item
    assert.equal($(".item-image .reject_badge").not(".hidden").length, 1);
  });
});

test("offer-messages thread details", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    // display 'General Messages' thread
    assert.equal($('div:contains("General Messages"):last').length, 1);

    var offer_message_thread_text = $('div:contains("General Messages"):last')
      .closest("span.info")
      .text();

    // display latest offer message in 'General Messages' thread
    assert.equal(
      offer_message_thread_text.indexOf(message1.get("body")) > 0,
      true
    );

    // display unread offer message count in 'General Messages' thread
    assert.equal(offer_message_thread_text.indexOf("1") > 0, true);
  });
});

test("ordering of message threads", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    // latest item message thread
    var latest_message_thread = $(".list li:eq(0)").text();
    assert.equal(
      latest_message_thread.indexOf(item3.get("donorDescription")) > 0,
      true
    );

    // second offer message thread
    var offer_message_thread = $(".list li:eq(1)").text();
    assert.equal(offer_message_thread.indexOf("General Messages") > 0, true);
  });
});

test("visit pending review item", function(assert) {
  assert.expect(1);
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    click(".list li a:contains('" + item3.get("donorDescription") + "')");
    andThen(function() {
      assert.equal(
        currentURL(),
        "/offers/" + offer.id + "/review_item/" + item3.id + "/accept"
      );
    });
  });
});

test("visit accepted item", function(assert) {
  assert.expect(1);
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    click(".list li a:contains('" + item1.get("donorDescription") + "')");
    andThen(function() {
      assert.equal(
        currentURL(),
        "/offers/" + offer.id + "/review_item/" + item1.id + "/accept"
      );
    });
  });
});

test("visit rejected item", function(assert) {
  assert.expect();
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    click(".list li a:contains('" + item2.get("donorDescription") + "')");
    andThen(function() {
      assert.equal(
        currentURL(),
        "/offers/" + offer.id + "/review_item/" + item2.id + "/reject"
      );
    });
  });
});

test("visit offer message threads", function(assert) {
  assert.expect(1);
  visit("/offers/" + offer.id + "/review_offer/items");
  andThen(function() {
    //offer message thread
    click(".list li a:contains('General Messages')");
    andThen(function() {
      assert.equal(currentURL(), "/offers/" + offer.id + "/donor_messages");
    });
  });
});

["closed", "cancelled", "received", "inactive"].forEach(state => {
  test(`add item button is disabled when offer is ${state}`, function(assert) {
    run(() => {
      offer.set("state", state);
      visit("/offers/" + offer.id + "/review_offer/items");
    });
    andThen(function() {
      const el = $("button.add-item");
      assert.equal(el.is(":disabled"), true);
    });
  });
});
