import Ember from "ember";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import "../factories/message";
import "../factories/offer";
import "../factories/item";
import "../factories/role";

var App, offer, item, message1, message2, message3, role, donor;

module("Reviewer: Display Item Messages", {
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

    donor = { id: "1000", first_name: "jane", last_name: "doe" };
    offer = { id: "300", state: "under_review", created_by_id: 1000 };
    item = { id: "110", state: "submitted", offer_id: offer.id };
    message1 = {
      id: "44",
      offer_id: offer.id,
      item_id: item.id,
      created_at: new Date("2015/1/1").toString(),
      is_private: false,
      sender_id: donor.id
    };
    message2 = {
      id: "45",
      offer_id: offer.id,
      item_id: item.id,
      body: "Message from Donor",
      created_at: new Date("2015/1/2").toString(),
      is_private: false,
      sender_id: donor.id
    };
    message3 = {
      id: "46",
      offer_id: offer.id,
      item_id: item.id,
      body: "Message from Supervisor",
      is_private: true
    };

    $.mockjax({
      url: "/api/v1/message*",
      type: "GET",
      status: 200,
      responseText: {
        messages: [message1, message2, message3],
        users: [donor]
      }
    });

    $.mockjax({
      url: "/api/v1/offer*",
      type: "GET",
      status: 200,
      responseText: {
        items: [item],
        offers: [offer],
        messages: [message1, message2, message3],
        users: [donor]
      }
    });

    $.mockjax({
      url: "/api/v1/canned_response*",
      type: "GET",
      status: 200,
      responseText: {
        canned_responses: []
      }
    });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    Ember.run(App, "destroy");
    $.mockjax.clear();
  }
});
