import Ember from "ember";
import _ from "lodash";

// --- Helpers

const STATE_FILTERS = {
  PRIORITY: "showPriority",
  NEW: "new",
  REVIEWING: "under_review",
  REVIEWED: "reviewed",
  SCHEDULED: "scheduled",
  RECEIVING: "receiving",
  RECEIVED: "received",
  CANCELLED: "cancelled",
  INACTIVE: "inactive"
};

function setFilter(filter, val) {
  Ember.$(`#${filter}`)[0].checked = val;
}

function checkFilter(filter) {
  setFilter(filter, true);
}

function uncheckFilter(filter) {
  setFilter(filter, false);
}

function isChecked(filter) {
  return Ember.$(`#${filter}`)[0].checked;
}

function startOfDay(date) {
  return moment(date)
    .startOf("day")
    .toDate();
}

function endOfDay(date) {
  return moment(date)
    .endOf("day")
    .toDate();
}

const STATE = "state";
const TYPE = "type";
const TIME = "time";
const UNKNOWN = "unknown";

// --- Component

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  filterService: Ember.inject.service(),

  selectedTimeRange: {
    preset: "",
    after: null,
    before: null
  },

  allOfferStateFilters: Ember.computed(function() {
    return _.values(STATE_FILTERS);
  }),

  offerStateFilters: Ember.computed("allOfferStateFilters.[]", function() {
    // Separate out "showPriority" filter as it has some different css properties than others
    return _.without(this.get("allOfferStateFilters"), STATE_FILTERS.PRIORITY);
  }),

  presetTimeKeys: Ember.computed(function() {
    return _.keys(this.get("filterService.offerTimeRangePresets"));
  }),

  filterContext: Ember.computed("applyStateFilter", function() {
    if (this.get("applyStateFilter")) {
      return STATE;
    }
    return UNKNOWN;
  }),

  // Marks filters as selected depending on pre-selected set of filters
  didInsertElement() {
    const service = this.get("filterService");
    const context = this.get("filterContext");

    switch (context) {
      case STATE:
        return service.get("offerStateFilters").forEach(checkFilter);
      case TIME:
        const { preset, after, before } = service.get("orderTimeRange");
        return this.set("selectedTimeRange", {
          preset,
          after: preset ? null : after,
          before: preset ? null : before
        });
    }
  },

  // Adds applied filters to localStorage as an array and redirects
  applyFilter(filters, name) {
    let filterService = this.get("filterService");
    let appliedFilters = filters.filter(isChecked);
    filterService.set(name, appliedFilters);
    this.navigateAway();
  },

  applyTimeFilters() {
    const { preset, after, before } = this.get("selectedTimeRange");
    this.get("filterService").setOfferTimeRange(preset || { after, before });
    this.navigateAway();
  },

  navigateAway() {
    this.get("router").transitionTo("search");
  },

  uncheckAll(filterType) {
    this.get(filterType).forEach(uncheckFilter);
  },

  clearTimeFilters() {
    this.set("selectedTimeRange.preset", null);
    this.set("selectedTimeRange.before", null);
    this.set("selectedTimeRange.after", null);
  },

  _setRangeProperty(prop, date) {
    this.set("selectedTimeRange.preset", null);
    this.set(`selectedTimeRange.${prop}`, date);
  },

  actions: {
    applyFilters() {
      if (this.get("applyStateFilter")) {
        return this.applyFilter(
          this.get("allOfferStateFilters"),
          "offerStateFilters"
        );
      }
      if (this.get("applyTimeFilter")) {
        return this.applyTimeFilters();
      }
    },

    selectTimePreset(presetKey) {
      this.clearTimeFilters();
      this.set("selectedTimeRange.preset", presetKey);
    },

    clearFilters() {
      if (this.get("applyStateFilter")) {
        return this.uncheckAll("allOfferStateFilters");
      }
    },

    setBeforeTime(before) {
      this._setRangeProperty("before", endOfDay(before));
    },

    setAfterTime(after) {
      this._setRangeProperty("after", startOfDay(after));
    }
  }
});
