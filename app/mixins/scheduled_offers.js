import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Mixin from "@ember/object/mixin";

export default Mixin.create({
  scheduledOffers: true,

  i18n: service(),

  pageTitle: computed(function() {
    return this.get("i18n").t("inbox.scheduled_offers");
  }),

  allDeliveries: computed(function() {
    return this.store.peekAll("delivery");
  }),

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  allValidDeliveries: computed("allDeliveries.[]", function() {
    return this.get("allDeliveries").filter(d => !d.get("offer.isFinished"));
  }),

  allValidOffers: computed("allOffers.[]", function() {
    return this.get("allOffers").filter(d => !d.get("isFinished"));
  }),

  allScheduledOffers: computed(
    "allValidOffers.{@each.isScheduled,@each.isFinished}",
    "allValidDeliveries.[]",
    function() {
      this.get("allValidDeliveries"); // extra call
      return this.get("allValidOffers").filter(d => d.get("isScheduled"));
    }
  ),

  dropOff: computed(
    "allScheduledOffers.@each.delivery.deliveryType",
    function() {
      return this.get("allScheduledOffers").filterBy("delivery.isDropOff");
    }
  ),

  collection: computed(
    "allScheduledOffers.@each.delivery.deliveryType",
    function() {
      return this.get("allScheduledOffers").filterBy("delivery.isAlternate");
    }
  ),

  ggv: computed("allScheduledOffers.@each.delivery.deliveryType", function() {
    return this.get("allScheduledOffers").filterBy("delivery.isGogovan");
  })
});
