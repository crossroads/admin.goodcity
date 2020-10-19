import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Component.extend({
  hidden: true,
  packageId: null,
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),

  selectedReason: null,
  invalidReason: false,
  displayUserPrompt: false,

  displayCustomReason: Ember.computed("selectedReason", function() {
    let translation = this.get("i18n");
    return this.get("selectedReason.name") == translation.t("other");
  }),

  cancellationOptions: Ember.computed(function() {
    return this.get("store")
      .peekAll("cancellation_reason")
      .sortBy("id");
  }),

  actions: {
    closeConfirmDialog() {
      this.set("displayUserPrompt", false);
    },

    openConfirmDialog() {
      this.set("displayUserPrompt", true);
    },

    confirmCancelOffer() {
      let cancelReason = this.get("offerCancelReason") || "";
      let selectedReason =
        this.get("selectedReason") ||
        this.get("cancellationOptions.firstObject");

      if (this.get("displayCustomReason") && cancelReason.trim().length == 0) {
        this.set("invalidReason", true);
        return false;
      }

      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var offer = this.get("offer");
      offer.set("cancelReason", cancelReason);
      offer.set("cancellationReason", selectedReason);
      offer.set("state_event", "cancel");
      this.set("offerCancelReason", "");

      offer.save().finally(() => {
        this.sendAction("toggleAction");
        loadingView.destroy();
      });
    }
  }
});
