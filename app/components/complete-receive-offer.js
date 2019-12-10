import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { getOwner } from "@ember/application";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Component.extend({
  store: service(),
  i18n: service(),
  displayUserPrompt: false,

  invalidMessage: computed({
    get() {
      return false;
    },
    set(key, value) {
      return value;
    }
  }),

  closeMessage: computed("offer.allPackagesMissing", {
    get() {
      var offer = this.get("offer");
      if (offer.get("allPackagesMissing")) {
        return this.get("i18n").t("review_offer.missing_offer_message").string;
      } else {
        return this.get("i18n").t("review_offer.receive_offer_message").string;
      }
    },
    set(key, value) {
      return value;
    }
  }),

  actions: {
    confirmCloseOffer() {
      this.set("displayUserPrompt", true);
    },

    closeOffer() {
      var closeOfferMessage = this.get("closeMessage") || "";

      if (closeOfferMessage.trim().length === 0) {
        this.set("invalidMessage", true);
        return false;
      }

      this.set("invalidMessage", false);

      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var offerId = this.get("offer.id");

      var url = "/offers/" + offerId + "/receive_offer";

      new AjaxPromise(url, "PUT", this.get("session.authToken"), {
        close_offer_message: closeOfferMessage
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
