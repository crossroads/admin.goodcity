import Ember from "ember";
import AjaxPromise from "goodcity/utils/ajax-promise";
import Promisify from "goodcity/utils/promisify";
const { getOwner } = Ember;

export default Ember.Component.extend({
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  messageService: Ember.inject.service(),
  displayUserPrompt: false,
  stopSharingAt: null,

  invalidMessage: Ember.computed({
    get() {
      return false;
    },
    set(key, value) {
      return value;
    }
  }),

  closeMessage: Ember.computed("offer.allPackagesMissing", function() {
    const offer = this.get("offer");
    if (offer.get("allPackagesMissing")) {
      return Promisify(() =>
        this.get("messageService").getSystemMessage({
          guid: "review-offer-missing-offer-message"
        })
      );
    } else {
      return Promisify(() =>
        this.get("messageService").getSystemMessage({
          guid: "review-offer-receive-offer-message"
        })
      );
    }
  }),

  actions: {
    confirmCloseOffer() {
      this.set("displayUserPrompt", true);
    },

    closeOffer() {
      let closeOfferMessage = "";
      if (this.get("offer.createdById")) {
        closeOfferMessage = this.get("closeMessage").content || "";
        if (closeOfferMessage.trim().length === 0) {
          this.set("invalidMessage", true);
          return false;
        }
      }

      this.set("invalidMessage", false);

      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var offerId = this.get("offer.id");

      let expressionMatch = closeOfferMessage.match(/\[(.*?)\]/);
      if (expressionMatch) {
        let expression = expressionMatch[1];
        let [mainText, replaceText] = expression.split("|");
        if (replaceText === "feedback_form") {
          closeOfferMessage = closeOfferMessage.replace(
            "[" + expression + "]",
            `<a href=' https://crossroads-foundation.formstack.com/forms/goodcity_feedback?OfferId=${offerId}'>${mainText}</a>`
          );
        }
      }
      var url = "/offers/" + offerId + "/receive_offer";

      new AjaxPromise(url, "PUT", this.get("session.authToken"), {
        close_offer_message: closeOfferMessage,
        sharing_expires_at: this.get("stopSharingAt")
      })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
        });
    }
  }
});
