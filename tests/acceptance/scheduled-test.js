import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import testSkip from "../helpers/test-skip";
import { module } from "qunit";
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
  delivery1,
  offer2,
  delivery2,
  offer3,
  delivery3,
  schedule4,
  offer4,
  delivery4,
  ggv_order,
  role;

module("Scheduled Offers", {
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

    delivery1 = FactoryGuy.make("delivery", {
      deliveryType: "Gogovan"
    });
    offer1 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery1
    });

    ggv_order = FactoryGuy.make("gogovan_order", {
      status: "pending"
    });
    schedule4 = FactoryGuy.make("schedule", {
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 30))
    });
    delivery4 = FactoryGuy.make("delivery", {
      deliveryType: "Gogovan",
      schedule: schedule4,
      gogovanOrder: ggv_order
    });
    offer4 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery4
    });

    delivery2 = FactoryGuy.make("delivery", {
      deliveryType: "Alternate"
    });
    offer2 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery2
    });

    delivery3 = FactoryGuy.make("delivery", {
      deliveryType: "Drop Off"
    });
    offer3 = FactoryGuy.make("offer_with_items", {
      state: "scheduled",
      delivery: delivery3
    });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

testSkip("viewing collection schedule", function(assert) {
  assert.expect(5);
  visit("/offers/scheduled");

  andThen(function() {
    assert.equal(currentURL(), "/offers/scheduled/collection");
    assert.equal(find("ul.list li").length, 1);
    assert.equal(find("ul.list img").length, 1);
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Collection") > 0,
      true
    );
    assert.equal(
      $.trim(
        find(".dynamic_filter select option")
          .first()
          .text()
      ),
      "All offers (1)"
    );
  });
});

testSkip("viewing gogovan delivery schedule", function(assert) {
  assert.expect(4);
  visit("/offers/scheduled/gogovan");

  andThen(function() {
    assert.equal(currentURL(), "/offers/scheduled/gogovan");
    assert.equal(find("ul.list li").length, 2);
    assert.equal(find("ul.list img").length, 2);
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Van ordered") > 0,
      true
    );
  });
});

testSkip("filtering gogovan delivery schedule", function(assert) {
  assert.expect(5);
  visit("/offers/scheduled/gogovan");

  andThen(function() {
    assert.equal(currentURL(), "/offers/scheduled/gogovan");

    var option = find(
      '.dynamic_filter select option:contains("After next week (1)")'
    ).val();
    $(".dynamic_filter select")
      .val(option)
      .change();

    andThen(function() {
      assert.equal(
        $.trim(find(".dynamic_filter select :selected").text()),
        "After next week (1)"
      );
      assert.equal(find("ul.list li").length, 1);
      assert.equal(find("ul.list img").length, 1);
      assert.equal(
        $(".time_indicator")
          .text()
          .indexOf("Van ordered") > 0,
        true
      );
    });
  });
});

testSkip("viewing other delivery schedule", function(assert) {
  assert.expect(4);
  visit("/offers/scheduled/other_delivery");

  andThen(function() {
    assert.equal(currentURL(), "/offers/scheduled/other_delivery");
    assert.equal(find("ul.list li").length, 1);
    assert.equal(find("ul.list img").length, 1);
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Drop-off") > 0,
      true
    );
  });
});
