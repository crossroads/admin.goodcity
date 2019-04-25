import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import { module, test } from "qunit";
import "../factories/user";
import "../factories/offer";
import "../factories/item";
import "../factories/role";
import "../factories/gogovan_order";
import "../factories/delivery";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import $ from "jquery";

var App,
  offer1,
  reviewer,
  reviewerName,
  offer2,
  item1,
  item2,
  delivery,
  offer3,
  item3,
  item4,
  offer4,
  item5,
  ggv_order,
  role,
  permission,
  rolePermission;

module("My Offers", {
  beforeEach: function() {
    App = startApp({}, 2);
    TestHelper.setup();
    role = FactoryGuy.make("role");
    permission = FactoryGuy.make("permission");
    rolePermission = FactoryGuy.make("role_permission", {
      roleId: role.get("id"),
      permissionId: permission.get("id")
    });
    $.mockjax({
      url: "/api/v1/role*",
      type: "GET",
      status: 200,
      responseText: {
        roles: [
          role.toJSON({
            includeId: true
          })
        ],
        role_permissions: [
          rolePermission.toJSON({
            includeId: true
          })
        ],
        permissions: [
          permission.toJSON({
            includeId: true
          })
        ]
      }
    });
    reviewer = FactoryGuy.make("user", {
      id: 3
    });
    offer1 = FactoryGuy.make("offer_with_items", {
      state: "under_review",
      reviewedBy: reviewer
    });
    reviewerName = reviewer.get("firstName") + " " + reviewer.get("lastName");

    offer2 = FactoryGuy.make("offer", {
      state: "reviewed",
      reviewedBy: reviewer
    });
    item1 = FactoryGuy.make("item", {
      state: "accepted",
      offer: offer2
    });
    item2 = FactoryGuy.make("item", {
      state: "rejected",
      offer: offer2
    });

    ggv_order = FactoryGuy.make("gogovan_order", {
      status: "pending"
    });
    delivery = FactoryGuy.make("delivery", {
      deliveryType: "Gogovan",
      gogovanOrder: ggv_order
    });
    offer3 = FactoryGuy.make("offer", {
      state: "scheduled",
      delivery: delivery,
      reviewedBy: reviewer
    });
    item3 = FactoryGuy.make("item", {
      state: "accepted",
      offer: offer3
    });
    item4 = FactoryGuy.make("item", {
      state: "rejected",
      offer: offer3
    });

    offer4 = FactoryGuy.make("offer", {
      state: "closed",
      reviewedBy: reviewer
    });
    item5 = FactoryGuy.make("item", {
      state: "rejected",
      offer: offer4
    });
  },
  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("redirect to reviewing offers page", function(assert) {
  assert.expect(5);
  visit("/offers/my_list");

  andThen(function() {
    assert.equal(currentURL(), "/offers/my_list/reviewing");
    assert.equal(find("ul.list li").length, 1);
    assert.equal(find("ul.list img").length, 1);

    // under-review status
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Started by ") > 0,
      true
    );
    var itemStatus = $("li.inbox_page:first span.info div:last")
      .text()
      .replace(/\s{1,}/g, " ");

    // items accept-reject status
    assert.equal(itemStatus, " 0 Accepted, 0 rejected, 2 pending ");
  });
});

test("redirect to reviewed offers page", function(assert) {
  assert.expect(6);
  visit("/offers/my_list/reviewed");

  andThen(function() {
    assert.equal(currentURL(), "/offers/my_list/reviewed");
    assert.equal(find("ul.list li").length, 1);
    assert.equal(find("ul.list img").length, 1);

    // reviewed status
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Reviewed") > 0,
      true
    );
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("User to plan transport.") > 0,
      true
    );

    // items accept-reject status
    var itemStatus = $("li.inbox_page:first span.info div:last")
      .text()
      .replace(/\s{1,}/g, " ");
    assert.equal(itemStatus, " 1 Accepted, 1 rejected, 0 pending ");
  });
});

test("redirect to scheduled offers page", function(assert) {
  assert.expect(5);
  visit("/offers/my_list/scheduled");

  andThen(function() {
    assert.equal(currentURL(), "/offers/my_list/scheduled");
    assert.equal(find("ul.list li").length, 1);
    assert.equal(find("ul.list img").length, 1);

    // scheduled status
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Van ordered") >= 0,
      true
    );

    // items accept-reject status
    var itemStatus = $("li.inbox_page:first span.info div:last")
      .text()
      .replace(/\s{1,}/g, " ");
    assert.equal(itemStatus, " 1 Accepted, 1 rejected, 0 pending ");
  });
});

test("redirect to finished offers page", function(assert) {
  assert.expect(5);
  visit("/offers/my_list/finished");

  andThen(function() {
    assert.equal(currentURL(), "/offers/my_list/finished");
    assert.equal(find("ul.list li").length, 2);
    assert.equal(find("ul.list img").length, 1);

    // reviewed status
    assert.equal(
      $(".time_indicator")
        .text()
        .indexOf("Closed") > 0,
      true
    );

    // items accept-reject status
    var itemStatus = $("li.inbox_page:first span.info div:last")
      .text()
      .replace(/\s{1,}/g, " ");
    assert.equal(itemStatus, " 0 Accepted, 1 rejected, 0 pending ");
  });
});
