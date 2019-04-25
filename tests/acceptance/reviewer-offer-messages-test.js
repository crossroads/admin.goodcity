import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import testSkip from "../helpers/test-skip";
import { module, test } from "qunit";
import "../factories/message";
import "../factories/offer";
import "../factories/user";
import "../factories/role";
import $ from "jquery";

var App,
  offer,
  message1,
  message2,
  message3,
  message4,
  message5,
  user1,
  user2,
  offer1,
  role;

module("Reviewer: Display Offer Messages", {
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
    user1 = FactoryGuy.make("user");
    user2 = FactoryGuy.make("user_with_image");
    offer = {
      id: 33,
      state: "under_review"
    };
    offer1 = {
      id: 34,
      createdBy: user1,
      state: "under_review"
    };
    message4 = {
      id: 81,
      offer_id: offer1.id,
      sender: user2.get("id"),
      item_id: null,
      body: "Message from donor1",
      created_at: new Date("2015/1/1").toString()
    };
    message5 = {
      id: 82,
      offer_id: offer1.id,
      sender_id: user1.get("id"),
      item_id: null,
      body: "Message from donor2",
      created_at: new Date("2015/1/2").toString()
    };
    message1 = {
      id: 83,
      offer_id: offer.id,
      item: null,
      created_at: new Date("2015/1/3").toString()
    };
    message3 = {
      id: 84,
      offer_id: offer.id,
      item: null,
      body: "Message from Supervisor",
      is_private: true
    };
    message2 = {
      id: 85,
      offer_id: offer.id,
      item: null,
      body: "Message from Donor",
      created_at: new Date("2015/1/4").toString()
    };

    let messages = [message1, message2, message3, message4, message5];
    let offers = [offer, offer1];

    $.mockjax({
      url: "/api/v1/message*",
      type: "GET",
      status: 200,
      responseText: {
        messages
      }
    });

    $.mockjax({
      url: "/api/v1/offer*",
      type: "GET",
      status: 200,
      responseText: {
        offers,
        messages
      }
    });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
    $.mockjax.clear();
  }
});

test("offer-messages from donor", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer.id + "/donor_messages");
  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/donor_messages");
    assert.equal($(".message_details").length, 2);

    var offer_message_thread_text = $(".message_details:last")
      .parent()
      .text();
    assert.equal(offer_message_thread_text.indexOf(message2.body) >= 0, true);
  });
});

test("offer-messages from Supervisor", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer.id + "/supervisor_messages");
  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/supervisor_messages");
    assert.equal($(".message_details").length, 1);

    var offer_message_thread_text = $(".message_details:last")
      .parent()
      .text();
    assert.equal(offer_message_thread_text.indexOf(message3.body) >= 0, true);
  });
});

test("offer-messages from donor should add unread bubble in donor message tab", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/supervisor_messages");
  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/supervisor_messages");

    FactoryGuy.make("message", {
      offer: offer,
      item: null,
      body: "Second Message from Donor"
    });

    // if message received from donor, add unread bubble mark
    assert.equal(
      $("a[href='/offers/" + offer.id + "/donor_messages'] i.unread").length,
      1
    );
  });
});

test("offer-messages from staff should add unread bubble in supervisor message tab", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/donor_messages");
  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer.id + "/donor_messages");

    FactoryGuy.make("message", {
      offer: offer,
      item: null,
      body: "Second Message from Supervisor",
      isPrivate: true
    });

    // if message received from donor, add unread bubble mark
    assert.equal(
      $("a[href='/offers/" + offer.id + "/supervisor_messages'] i.unread")
        .length,
      1
    );
  });
});

testSkip("offer-message with image", function(assert) {
  assert.expect(1);
  visit("/offers/" + offer1.id + "/donor_messages");
  andThen(function() {
    var src = $(".received_message#" + message4.id + " img").attr("src");
    assert.equal(src.indexOf("cloudinary") > 0, true);
  });
});
