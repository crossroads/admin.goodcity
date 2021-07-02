import Ember from "ember";

export default Ember.Component.extend({
  store: Ember.inject.service(),
  offer: null,
  stopSharingAt: null,

  allShareables: Ember.computed(function() {
    return this.get("store").peekAll("shareable");
  }),

  isSharedOffer: Ember.computed(
    "offer.id",
    "allShareables.length",
    "allShareables.[]",
    "allShareables.@each.{id,active,publicUid}",
    function() {
      return this.get("allShareables").find(sh => {
        return (
          sh.get("resourceType") == "Offer" &&
          sh.get("resourceId") == this.get("offer.id") &&
          sh.get("active")
        );
      });
    }
  ),

  allowListingEnabled: Ember.computed.alias("isSharedOffer.allowListing"),

  selectedStopSharingTime: Ember.computed(function() {
    return moment().format("hh:mm");
  }),

  selectedStopSharingDate: Ember.computed(function() {
    return moment().format("DD/MM/YY");
  }),

  stopSharingObserver: Ember.observer(
    "selectedStopSharingTime",
    "selectedStopSharingDate",
    function() {
      this.set(
        "stopSharingAt",
        `${this.get("selectedStopSharingDate")} ${this.get(
          "selectedStopSharingTime"
        )} HKT`
      );
    }
  ),

  actions: {
    resetDateToNow() {
      this.set("selectedStopSharingDate", moment().format("DD/MM/YY"));
      this.set("selectedStopSharingTime", moment().format("hh:mm"));
    },

    //Remove when Ember is upgraded to >= 3.0
    updateErrorMessage() {
      return false;
    }
  }
});
