import { computed } from "@ember/object";
import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";
import scheduledOffersMixin from "./../../mixins/scheduled_offers";

export default Controller.extend(scheduledOffersMixin, {
  sortProperties: [
    "unreadMessagesCount:desc",
    "delivery.schedule.scheduledAt:desc"
  ],
  arrangedContent: sort("allScheduled", "sortProperties"),

  filterValue: computed({
    get: function() {
      return null;
    },
    set: function(key, value) {
      return value;
    }
  }),

  filteredOffers: computed("filterValue", "allScheduled.[]", function() {
    var filter = this.get("filterValue.id");
    return this.filterOffers(filter || "all");
  }),

  allScheduled: computed("collection.[]", {
    get: function() {
      return this.get("collection");
    },
    set: function(key, value) {
      return value;
    }
  }),

  overdue: function() {
    return this.get("allScheduled").filter(function(offer) {
      var date = offer.get("delivery.schedule.scheduledAt");
      return moment(date).isBefore(moment(), "day");
    });
  },

  nextWeek: function() {
    var nextWeekEnd = moment()
      .day(6)
      .endOf("day");
    var afterNextWeekStart = moment()
      .day(14)
      .startOf("day");

    return this.get("allScheduled").filter(function(offer) {
      var date = offer.get("delivery.schedule.scheduledAt");
      return moment(date).isBetween(nextWeekEnd, afterNextWeekStart, "day");
    });
  },

  afterNextWeek: function() {
    var weekend = moment()
      .day(13)
      .endOf("day");

    return this.get("allScheduled").filter(function(offer) {
      var date = offer.get("delivery.schedule.scheduledAt");
      return moment(date).isAfter(weekend, "day");
    });
  },

  daySchedule: function(dayValue) {
    var day = dayValue ? moment().day(dayValue) : moment();

    return this.get("allScheduled").filter(function(offer) {
      var date = offer.get("delivery.schedule.scheduledAt");
      return moment(date).isSame(day, "day");
    });
  },

  filterOffers: function(filterValue) {
    var offers;
    switch (filterValue) {
      case "all":
        offers = this.get("allScheduled");
        break;
      case "overdue":
        offers = this.overdue();
        break;
      case "next":
        offers = this.nextWeek();
        break;
      case "after_next":
        offers = this.afterNextWeek();
        break;
      case "today":
        offers = this.daySchedule();
        break;
      default:
        offers = this.daySchedule(filterValue);
        break;
    }
    return offers;
  }
});
