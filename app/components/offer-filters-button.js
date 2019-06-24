import Ember from "ember";
import _ from "lodash";

export default Ember.Component.extend({
  filterService: Ember.inject.service(),

  offerStateFilters: Ember.computed.alias("filterService.offerStateFilters"),
  hasStateFilters: Ember.computed("offerStateFilters", function() {
    return this.get("offerStateFilters").length > 0;
  }),

  offerTimeRange: Ember.computed.alias("filterService.offerTimeRange"),

  hasTimeFilters: Ember.computed("offerTimeRange", function() {
    const { preset, after, before } = this.get("offerTimeRange");
    return preset || after || before;
  }),

  presetTimeKeys: Ember.computed(function() {
    return _.keys(this.get("filterService.offerTimeRangePresets"));
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
    },

    clearTimeFilters() {
      this.get("filterService").clearOfferTimeFilters();
    }
  }
});
