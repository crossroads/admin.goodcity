import $ from "jquery";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { getOwner } from "@ember/application";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Component.extend({
  hidden: true,
  packageId: null,
  store: service(),
  i18n: service(),
  invalidMessage: false,
  displayUserPrompt: false,

  inactiveMessage: computed(function() {
    return this.get("i18n").t("inactive_offer.message");
  }),

  actions: {
    confirmMarkOfferInactive() {
      this.set("displayUserPrompt", true);
    },

    markOfferInactive() {
      var inactiveMessage =
        this.get("inactiveMessage.string") || this.get("inactiveMessage");

      if ($.trim(inactiveMessage).length === 0) {
        this.set("invalidMessage", true);
        return;
      }

      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();

      var offer = this.get("offer");
      var url = "/offers/" + offer.id + "/mark_inactive";

      new AjaxPromise(url, "PUT", this.get("session.authToken"), {
        offer: { inactive_message: inactiveMessage }
      })
        .then(data => {
          this.get("store").pushPayload(data);
        })
        .finally(() => {
          loadingView.destroy();
          this.toggleAction();
        });
    }
  }
});
