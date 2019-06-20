import Ember from "ember";
import timeRanges from "../utils/time-ranges";
import _ from "lodash";

// --- Helpers

const PERSISTENT_VAR = function(propName, defaultValue, deserializeMap = {}) {
  return Ember.computed({
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

// @TODO: priority should not be a state filter
export const STATE_FILTERS = {
  PRIORITY: "showPriority",
  NEW: "new",
  REVIEWING: "reviewing",
  REVIEWED: "reviewed",
  SCHEDULED: "scheduled",
  RECEIVING: "receiving",
  RECEIVED: "received",
  CANCELLED: "cancelled",
  INACTIVE: "inactive"
};

export const TYPE_FILTERS = {
  APPOINTMENT: "appointment",
  ONLINE_ORDER: "online_orders",
  SHIPMENT: "shipment"
};

// --- Service

export default Ember.Service.extend(Ember.Evented, {
  localStorage: Ember.inject.service(),

  offerStateFilters: PERSISTENT_VAR("offerStateFilters", []),

  isPriority() {
    const filters = this.get("offerStateFilters");
    return filters && filters.indexOf(STATE_FILTERS.PRIORITY) >= 0;
  },

  clearOfferStateFilters() {
    this.set("offerStateFilters", []);
  },

  clearFilters() {
    this.clearOfferStateFilters();
  },

  hasOrderFilters: Ember.computed("offerStateFilters", function() {
    const timeRange = this.get("orderTimeRange");
    return this.get("offerStateFilters").length > 0;
  }),

  // --- Order time filters

  _orderTimeSettings: PERSISTENT_VAR(
    "orderTimeSettings",
    {},
    {
      after: raw => new Date(raw),
      before: raw => new Date(raw)
    }
  ),

  orderTimeRangePresets: Ember.computed(function() {
    return timeRanges;
  }).volatile(),

  /**
   * Saves the time range filter for order search
   *
   * @param {String|Object} range A time range OR a preset name
   */
  setOrderTimeRange(range) {
    if (_.isString(range)) {
      const preset = range;
      this.set("_orderTimeSettings", { preset });
    } else {
      this.set("_orderTimeSettings", {
        preset: null,
        after: _.get(range, "after"),
        before: _.get(range, "before")
      });
    }

    this.notifyPropertyChange("orderTimeRange");
  },

  /**
   * Returns the order time range filter
   * If a preset was previously selected, it will be re-computed based
   * on the current time.
   *
   * @param {String|Object} range A time range OR a preset name
   */
  orderTimeRange: Ember.computed(function() {
    const { preset = "", after = null, before = null } = this.get(
      "_orderTimeSettings"
    );

    if (preset) {
      return _.extend({ preset }, this.get(`orderTimeRangePresets.${preset}`));
    }
    return { preset, after, before };
  }).volatile()
});
