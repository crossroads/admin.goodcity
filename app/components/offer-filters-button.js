import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import _ from "lodash";

export default Component.extend({
  filterService: service(),

  offerStateFilters: alias("filterService.offerStateFilters"),
  hasStateFilters: computed("offerStateFilters", function() {
    return this.get("offerStateFilters").length > 0;
  }),

  offerTimeRange: alias("filterService.offerTimeRange"),

  selfReviewFilter: alias("filterService.selfReviewFilter"),

  hasTimeFilters: computed("offerTimeRange", function() {
    const { preset, after, before } = this.get("offerTimeRange");
    return preset || after || before;
  }),

  presetTimeKeys: computed(function() {
    return _.keys(this.get("filterService.offerTimeRangePresets"));
  }),

  actions: {
    redirectTofilters(queryParam) {
      const offerFilter = {};
      offerFilter[queryParam] = true;
      this.get("router").transitionTo("offers_filters", {
        queryParams: offerFilter
      });
    }
  }
});
