import Evented from "@ember/object/evented";
import Service, { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import timeRanges from "../utils/time-ranges";
import _ from "lodash";

// --- Helpers

const PERSISTENT_VAR = function(propName, defaultValue, deserializeMap = {}) {
  return computed({
    get() {
      const data = this.get("localStorage").read(propName, defaultValue);
      for (let key in deserializeMap) {
        if (data[key]) {
          data[key] = deserializeMap[key](data[key]);
        }
      }
      return data;
    },
    set(k, value) {
      this.get("localStorage").write(propName, value);
      this.trigger("change");
      return value;
    }
  });
};

export const STATE_FILTERS = {
  PRIORITY: "showPriority",
  NEW: "submitted",
  REVIEWING: "under_review",
  REVIEWED: "reviewed",
  SCHEDULED: "scheduled",
  RECEIVING: "receiving",
  RECEIVED: "received",
  CANCELLED: "cancelled",
  INACTIVE: "inactive"
};

// --- Service

export default Service.extend(Evented, {
  localStorage: service(),
  router: service(),

  offerStateFilters: PERSISTENT_VAR("offerStateFilters", []),

  isPriority() {
    const filters = this.get("offerStateFilters");
    return filters && filters.indexOf(STATE_FILTERS.PRIORITY) >= 0;
  },

  clearOfferStateFilters() {
    this.set("offerStateFilters", []);
  },

  clearOfferTimeFilters() {
    this.setOfferTimeRange(null);
  },

  clearReviewFilters() {
    this.set("selfReviewFilter", false);
  },

  clearFilters() {
    this.clearOfferStateFilters();
    this.clearOfferTimeFilters();
    this.clearReviewFilters();
  },

  clearAndApplyStateFilter(state, selfReview, priority = false) {
    this.clearFilters();
    let states = [];
    if (selfReview) {
      this.set("selfReviewFilter", true);
    }
    if (priority) {
      states.push(STATE_FILTERS.PRIORITY);
    }
    states.push(state);
    this.set("offerStateFilters", states);
    this.get("router").transitionTo("search");
  },

  hasOfferFilters: computed("offerStateFilters", function() {
    const timeRange = this.get("offerTimeRange");
    return this.get("offerStateFilters").length > 0;
  }),

  // --- Reviewer filters
  selfReviewFilter: PERSISTENT_VAR("selfReviewFilter", false),

  enableReviewFilter() {
    this.set("selfReviewFilter", true);
  },

  // --- Offer time filters

  _offerTimeSettings: PERSISTENT_VAR(
    "offerTimeSettings",
    {},
    {
      after: raw => new Date(raw),
      before: raw => new Date(raw)
    }
  ),

  offerTimeRangePresets: computed(function() {
    return timeRanges;
  }).volatile(),

  /**
   * Saves the time range filter for offer search
   *
   * @param {String|Object} range A time range OR a preset name
   */
  setOfferTimeRange(range) {
    if (_.isString(range)) {
      const preset = range;
      this.set("_offerTimeSettings", { preset });
    } else {
      this.set("_offerTimeSettings", {
        preset: null,
        after: _.get(range, "after"),
        before: _.get(range, "before")
      });
    }

    this.notifyPropertyChange("offerTimeRange");
  },

  /**
   * Returns the offer time range filter
   * If a preset was previously selected, it will be re-computed based
   * on the current time.
   *
   * @param {String|Object} range A time range OR a preset name
   */
  offerTimeRange: computed(function() {
    const { preset = "", after = null, before = null } = this.get(
      "_offerTimeSettings"
    );

    if (preset) {
      return _.extend({ preset }, this.get(`offerTimeRangePresets.${preset}`));
    }
    return { preset, after, before };
  }).volatile()
});
