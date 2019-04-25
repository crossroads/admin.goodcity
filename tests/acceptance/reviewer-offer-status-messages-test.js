import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import { module, test } from "qunit";
import "../factories/user";
import "../factories/offer";
import "../factories/item";
import "../factories/schedule";
import "../factories/gogovan_order";
import "../factories/delivery";
import "../factories/role";
import $ from "jquery";

var App,
  offer1,
  offer2,
  reviewer,
  reviewerName,
  offer7,
  offer3,
  offer4,
  delivery1,
  delivery2,
  offer5,
  delivery3,
  offer6,
  offer8,
  item8,
  offer9,
  item9,
  offer10,
  schedule,
  ggv_order11,
  delivery11,
  offer11,
  offer12,
  role;

module("Reviewer: Display Offer Status", {
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

    reviewer = FactoryGuy.make("user");
    offer1 = FactoryGuy.make("offer_with_items", {
      state: "submitted"
    });

    offer2 = FactoryGuy.make("offer_with_items", {
      state: "under_review",
      reviewedBy: reviewer
    });
    reviewerName = reviewer.get("firstName") + " " + reviewer.get("lastName");

    offer3 = FactoryGuy.make("offer_with_items", {
      state: "reviewed"
    });

    schedule = FactoryGuy.make("schedule", {
      scheduledAt: "12/01/2014"
    });
    delivery1 = FactoryGuy.make("delivery", {
      deliveryType: "Alternate",
      schedule: schedule
    });
    offer4 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery1
    });

    delivery2 = FactoryGuy.make("delivery", {
      deliveryType: "Gogovan",
      schedule: schedule
    });
    offer5 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery2
    });

    delivery3 = FactoryGuy.make("delivery", {
      deliveryType: "Drop Off",
      schedule: schedule
    });
    offer6 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery3
    });

    offer7 = FactoryGuy.make("offer_with_items", {
      state: "closed",
      reviewedBy: reviewer
    });

    offer8 = FactoryGuy.make("offer", {
      state: "under_review"
    });
    item8 = FactoryGuy.make("item", {
      state: "rejected",
      offer: offer8
    });

    offer9 = FactoryGuy.make("offer", {
      state: "under_review"
    });
    item9 = FactoryGuy.make("item", {
      state: "accepted",
      offer: offer9
    });

    offer10 = FactoryGuy.make("offer_with_items", {
      state: "received"
    });

    ggv_order11 = FactoryGuy.make("gogovan_active_order");
    delivery11 = FactoryGuy.make("delivery", {
      deliveryType: "Gogovan",
      gogovanOrder: ggv_order11
    });
    offer11 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery11
    });
    offer12 = FactoryGuy.make("offer_with_items", {
      state: "cancelled"
    });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("Display offer status for submitted offer", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer1.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer1.id + "/review_offer/items");
    assert.equal($.trim(find(".status-message").text()), "Start Review");
  });
});

// display initial char with message
test("Display offer status for offer under review", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer2.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer2.id + "/review_offer/items");

    // message detail
    var status = $.trim(find(".status-message").text());
    assert.equal(status.indexOf("Started by " + reviewerName) >= 0, true);
    assert.equal(status.indexOf(reviewer.get("nameInitial")) >= 0, true);
  });
});

test("Display offer status for reviewed offer", function(assert) {
  assert.expect(1);
  visit("/offers/" + offer3.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer3.id + "/review_offer/items");

    // var message = $.trim(find('.status-message').text().replace(/\n/g, ''));
    // assert.equal(message, "Reviewed less than a minute ago. User to plan transport." );
  });
});

test("Display offer status for scheduled offer: Collection", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer4.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer4.id + "/review_offer/items");
    assert.equal(
      $.trim(
        find(".status-message")
          .text()
          .replace(/\s{2,}/g, " ")
      ),
      "Collection Mon 1st Dec Afternoon"
    );
  });
});

test("Display offer status for scheduled offer: Gogovan pending", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer5.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer5.id + "/review_offer/items");
    assert.equal(
      $.trim(
        find(".status-message")
          .text()
          .replace(/\s{2,}/g, " ")
      ),
      "Van ordered Afternoon, 2pm-4pm Mon 1st Dec"
    );
  });
});

test("Display offer status for scheduled offer: Gogovan active", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer11.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer11.id + "/review_offer/items");
    var status = $.trim(
      find(".status-message")
        .text()
        .replace(/\s{2,}/g, " ")
    );
    assert.equal(status.indexOf("Van confirmed Afternoon, 2pm-4pm") >= 0, true);
  });
});

test("Display offer status for scheduled offer: Drop Off", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer6.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer6.id + "/review_offer/items");
    assert.equal(
      $.trim(
        find(".status-message")
          .text()
          .replace(/\s{2,}/g, " ")
      ),
      "Drop-off Mon 1st Dec Afternoon"
    );
  });
});

test("Display offer status for closed offer", function(assert) {
  assert.expect(1);
  visit("/offers/" + offer7.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer7.id + "/review_offer/items");
    // assert.equal($.trim(find('.status-message').text()), "Offer closed by " + reviewerName + " less than a minute ago");
  });
});

test("Display offer status for all rejected items", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer8.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer8.id + "/review_offer/items");
    assert.equal(
      $.trim(find(".status-message").text()).indexOf("No items needed") >= 0,
      true
    );
  });
});

test("Display offer status for all reviewed items", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer9.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer9.id + "/review_offer/items");
    assert.equal(
      find(".status-message")
        .text()
        .replace(/ /g, " ")
        .indexOf("All items reviewed") >= 0,
      true
    );
  });
});

test("Display offer status for received offer-items", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer10.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer10.id + "/review_offer/items");
    var donor_name =
      offer10.get("createdBy.firstName") +
      " " +
      offer10.get("createdBy.lastName");
    assert.equal(
      $(".status-message")
        .text()
        .trim()
        .indexOf("Goods donated by " + donor_name + " received") >= 0,
      true
    );
  });
});

test("Display offer status for cancelled offer", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer12.id + "/review_offer/items");

  andThen(function() {
    assert.equal(currentURL(), "/offers/" + offer12.id + "/review_offer/items");
    var donor_name =
      offer12.get("closedBy.firstName") +
      " " +
      offer12.get("closedBy.lastName");
    assert.equal(
      $(".status-message")
        .text()
        .trim()
        .indexOf("Cancelled by " + donor_name) >= 0,
      true
    );
  });
});
