import Ember from "ember";
import AjaxPromise from "goodcity/utils/ajax-promise";
import Promisify from "goodcity/utils/promisify";
const { getOwner } = Ember;
import { translationMacro as t } from "ember-i18n";

export default Ember.Component.extend({
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  invalidMessage: false,
  invalidSelection: false,
  rejectOffer: Ember.computed.alias("offer.allItemsRejected"),
  displayUserPrompt: false,
  messageService: Ember.inject.service(),

  selectedGogovanOption: "",
  ggvOptionPlaceholder: t("logistics.choose_ggv_option"),

  summaryText: Ember.computed("rejectOffer", function() {
    if (this.get("rejectOffer")) {
      return this.get("i18n").t("review_offer.close_offer_summary");
    }
  }),

  closeMessage: Ember.computed("offer", function() {
    if (this.get("rejectOffer")) {
      return Promisify(() =>
        this.get("messageService").getSystemMessage({
          guid: "review-offer-close-offer-message"
        })
      );
    } else {
      return Promisify(() =>
        this.get("messageService").getSystemMessage({
          guid: "logistics-complete-review-message"
        })
      );
    }
  }),

  gogovanOptions: Ember.computed(function() {
    var allOptions = this.get("store").peekAll("gogovan_transport");
    var options = allOptions.rejectBy("disabled", true).sortBy("id");
    var disabledOption = allOptions.filterBy("disabled", true);
    return options.concat(disabledOption);
  }),

  actions: {
    confirmCloseOffer() {
      this.set("displayUserPrompt", true);
    },

    completeReview() {
      var completeReviewMessage = "";

      if (this.get("offer.createdById")) {
        completeReviewMessage = this.get("closeMessage").content || "";
        if (completeReviewMessage.trim().length === 0) {
          this.set("invalidMessage", true);
          return false;
        }
      }

      this.set("invalidMessage", false);

      var offerId = this.get("offer.id");
      var offerProperties = {},
        action;

      if (this.get("rejectOffer")) {
        action = "close_offer";
      } else {
        var gogovanOptionId = this.get("selectedGogovanOption.id");
        if (gogovanOptionId === undefined) {
          this.set("invalidSelection", true);
          return false;
        }
        this.set("invalidSelection", false);

        offerProperties = {
          gogovan_transport_id: gogovanOptionId,
          state_event: "finish_review",
          id: offerId
        };
        action = "complete_review";
      }

      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var url_with_text = completeReviewMessage.slice(
        completeReviewMessage.indexOf("[") + 1,
        completeReviewMessage.indexOf("]")
      );
      var url_text_begin = url_with_text.indexOf("|");
      var url_text = url_with_text.slice(0, url_text_begin);
      var url_for = url_with_text.slice(url_text_begin + 1);
      var url = `/offers/${offerId}/${action}`;

      if (url_for === "transport_page") {
        completeReviewMessage = completeReviewMessage.replace(
          "[" + url_with_text + "]",
          `<a href='#/offers/${offerId}/plan_delivery'>${url_text}</a>`
        );
      }

      new AjaxPromise(url, "PUT", this.get("session.authToken"), {
        offer: offerProperties,
        complete_review_message: completeReviewMessage
      })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => loadingView.destroy());
    }
  }
});
