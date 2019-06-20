import Ember from "ember";
import _ from "lodash";

export default Ember.Component.extend({
  filterService: Ember.inject.service(),

  offerStateFilters: Ember.computed.alias("filterService.offerStateFilters"),
  hasStateFilters: Ember.computed("offerStateFilters", function() {
    return this.get("offerStateFilters").length > 0;
  }),

  presetTimeKeys: Ember.computed(function() {
    return _.keys(this.get("filterService.orderTimeRangePresets"));
  }),

  actions: {
    redirectTofilters(queryParam) {
      const offerFilter = {};
      offerFilter[queryParam] = true;
      this.get("router").transitionTo("offers_filters", {
        queryParams: offerFilter
      });
    },

    clearStateFilters() {
      this.get("filterService").clearOfferStateFilters();
    }
  }
});
