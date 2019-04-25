import $ from "jquery";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { getOwner } from "@ember/application";

export default Component.extend({
  hidden: true,
  packageId: null,
  store: service(),
  i18n: service(),

  selectedReason: null,
  invalidReason: false,
  displayUserPrompt: false,

  displayCustomReason: computed("selectedReason", function() {
    return this.get("selectedReason.id") === "-1";
  }),

  cancellationOptions: computed(function() {
    var reasons = this.get("store")
      .peekAll("cancellation_reason")
      .sortBy("id");
    reasons.push({ id: "-1", name: this.get("i18n").t("other") });
    return reasons;
  }),

  actions: {
    confirmCancelOffer() {
      this.set("displayUserPrompt", true);
    },

    cancelOffer() {
      var cancelReason, selectedReason;

      if (this.get("displayCustomReason")) {
        cancelReason = this.get("offer.cancelReason");
        if ($.trim(cancelReason).length === 0) {
          this.set("invalidReason", true);
          return;
        }
        this.set("invalidReason", false);
      } else {
        selectedReason = this.get("selectedReason");
      }
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var offer = this.get("offer");
      offer.set("cancelReason", cancelReason);
      offer.set("cancellationReason", selectedReason);
      offer.set("state_event", "cancel");

      offer.save().finally(() => {
        this.sendAction("toggleAction");
        loadingView.destroy();
      });
    }
  }
});
