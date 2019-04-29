import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { sort, alias } from "@ember/object/computed";
import Controller from "@ember/controller";
import { getOwner } from "@ember/application";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.sortProperties = ["updatedAt:desc"];
  },
  arrangedContent: sort("offersForMerge", "sortProperties"),

  offerDonor: alias("model.createdBy"),
  messageBox: service(),
  i18n: service(),

  locale: function(str) {
    return this.get("i18n").t(str);
  },

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  offersForMerge: computed(
    "allOffers.@each.state",
    "model",
    "offerDonor",
    function() {
      return this.get("allOffers")
        .filterBy("createdBy", this.get("offerDonor"))
        .filterBy("baseForMerge", true)
        .rejectBy("id", this.get("model.id"));
    }
  ),

  actions: {
    confirmMergeOffer(offer) {
      this.get("messageBox").custom(
        this.locale("offer.merge.message"),
        this.locale("offer.merge.merge"),
        () => this.send("mergeOffer", offer),
        this.locale("cancel")
      );
    },

    mergeOffer(baseOffer) {
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();

      var offer = this.get("model");
      var url = "/offers/" + offer.id + "/merge_offer";

      new AjaxPromise(url, "PUT", this.get("session.authToken"), {
        base_offer_id: baseOffer.id
      }).then(data => {
        loadingView.destroy();
        if (data.status) {
          this.transitionToRoute("review_offer.items", baseOffer);
        } else {
          this.get("messageBox").alert(this.locale("offer.merge.error"));
        }
      });
    }
  }
});
