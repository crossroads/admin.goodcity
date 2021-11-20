import Ember from "ember";
import AjaxPromise from "goodcity/utils/ajax-promise";
const { getOwner } = Ember;

export default Ember.Controller.extend({
  sortProperties: ["updatedAt:desc"],
  arrangedContent: Ember.computed.sort("offersForMerge", "sortProperties"),

  offerDonor: Ember.computed.alias("offer.createdBy"),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  apiBaseService: Ember.inject.service(),

  locale: function(str) {
    return this.get("i18n").t(str);
  },

  actions: {
    confirmMergeOffer(offer) {
      this.get("messageBox").custom(
        this.locale("offer.merge.message"),
        this.locale("offer.merge.merge"),
        () => this.send("mergeOffer", offer),
        this.locale("cancel")
      );
    },

    async mergeOffer(baseOffer) {
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var offer = this.get("offer");
      var url = "/offers/" + offer.id + "/merge_offer";
      const data = await this.get("apiBaseService").PUT(url, {
        base_offer_id: baseOffer.id
      });

      loadingView.destroy();
      if (data.status) {
        this.transitionToRoute("review_offer.items", baseOffer);
      } else {
        this.get("messageBox").alert(this.locale("offer.merge.error"));
      }
    }
  }
});
