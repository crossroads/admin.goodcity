import Ember from "ember";
import AjaxPromise from "goodcity/utils/ajax-promise";
const { getOwner } = Ember;

export default Ember.Component.extend({
  hidden: true,
  packageId: null,
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  invalidMessage: false,
  displayUserPrompt: false,

  inactiveMessage: Ember.computed(function() {
    return this.get("i18n").t("inactive_offer.message");
  }),

  actions: {
    confirmMarkOfferInactive() {
      this.set("displayUserPrompt", true);
    },

    markOfferInactive() {
      var inactiveMessage =
        this.get("inactiveMessage.string") || this.get("inactiveMessage");

      if (!inactiveMessage) {
        this.set("invalidMessage", true);
        return false;
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
          this.sendAction("toggleAction");
        });
    }
  }
});
