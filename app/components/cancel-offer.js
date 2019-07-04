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
    return this.get("selectedReason.id") === "-1";
  }),

  cancellationOptions: Ember.computed(function() {
    var reasons = this.get("store")
      .peekAll("cancellation_reason")
      .sortBy("id");
    reasons.push({ id: "-1", name: this.get("i18n").t("other") });
    return reasons;
  }),

  actions: {
    closeConfirmDialog() {
      this.set("displayUserPrompt", false);
    },

    openConfirmDialog() {
      this.set("displayUserPrompt", true);
    },

    confirmCancelOffer() {
      let cancelReason, selectedReason;

      if (this.get("displayCustomReason")) {
        cancelReason = this.get("offer.cancelReason");
        if (Ember.$.trim(cancelReason).length === 0) {
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
