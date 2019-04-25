import { run } from "@ember/runloop";
import startApp from "../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import testSkip from "../helpers/test-skip";
import { module, test } from "qunit";
import "../factories/offer";
import "../factories/role";
import $ from "jquery";

var App, offer, item1, item2, role;

module("Reviewer: Rejct Item Tab", {
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

    offer = FactoryGuy.make("offer", {
      state: "under_review"
    });
    item1 = FactoryGuy.make("item_with_type", {
      offer: offer
    });
    item2 = FactoryGuy.make("item", {
      offer: offer
    });
  },

  afterEach: function() {
    Em.run(function() {
      TestHelper.teardown();
    });
    run(App, "destroy");
  }
});

test("visit rejected item without item_type", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer.id + "/review_item/" + item2.id + "/reject");
  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item2.id + "/reject"
    );
    assert.equal($(".item_lable_input input").val(), "");
    assert.equal($("p.no-items").text(), "Please choose Item Type first!");
  });
});

testSkip("visit rejected item with item_type", function(assert) {
  assert.expect(4);
  visit("/offers/" + offer.id + "/review_item/" + item1.id + "/reject");
  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item1.id + "/reject"
    );
    assert.equal(
      $(".item_lable_input input").val(),
      item1.get("packageType.name")
    );
    assert.equal($(".reject-offer ul li").length, 4);

    //placeholder message in recjectio comments textarea
    assert.equal(
      $("textarea").attr("placeholder"),
      "Message to donor about the rejection of this item"
    );
  });
});

test("validate at least one option selected", function(assert) {
  assert.expect(2);
  visit("/offers/" + offer.id + "/review_item/" + item1.id + "/reject");
  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item1.id + "/reject"
    );
    click(".rejectOffer");
    andThen(function() {
      assert.equal($.trim($(".error-box").text()), "Please choose a reason.");
    });
  });
});

testSkip("display message for quality option", function(assert) {
  assert.expect(3);
  visit("/offers/" + offer.id + "/review_item/" + item1.id + "/reject");
  andThen(function() {
    assert.equal(
      currentURL(),
      "/offers/" + offer.id + "/review_item/" + item1.id + "/reject"
    );
    click($("input[type=radio]:eq(0)"));
    andThen(function() {
      // set textarea conent on click of radio option
      assert.equal(
        $("textarea").val(),
        "Unfortunately we cannot receive this item. Some categories of items are very difficult for us to distribute unless they are in excellent condition."
      );

      // clear message conent on click of x-icon
      click($(".remove-text"));
      andThen(function() {
        assert.equal($("textarea").val(), "");
      });
    });
  });
});
