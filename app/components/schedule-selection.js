import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";

export default Component.extend({
  attributeBindings: ["schedules", "selectedValue"],
  i18n: service(),

  weekDays: computed("schedules", function() {
    var _this = this;
    var currentDay = moment().day();
    var week = moment.weekdays();

    var options = [
      {
        name:
          this.get("i18n").t("scheduled.all_offers") +
          " (" +
          _this.allCount() +
          ")",
        id: "all"
      },
      {
        name:
          this.get("i18n").t("scheduled.overdue") +
          " (" +
          _this.overdueCount() +
          ")",
        id: "overdue"
      },
      {
        name:
          this.get("i18n").t("scheduled.today") +
          " (" +
          _this.scheduleCount() +
          ")",
        id: "today"
      }
    ];

    for (var i = currentDay + 1; i < week.length; i++) {
      options.push({
        name: week[i] + " (" + _this.scheduleCount(week[i]) + ")",
        id: week[i]
      });
    }

    options.push({
      name:
        this.get("i18n").t("scheduled.next_week") +
        " (" +
        _this.nextWeekCount() +
        ")",
      id: "next"
    });
    options.push({
      name:
        this.get("i18n").t("scheduled.after_next_week") +
        " (" +
        _this.afterNextWeekCount() +
        ")",
      id: "after_next"
    });
    return options;
  }),

  overdueCount: function() {
    return this.get("currentController").overdue().length;
  },

  scheduleCount: function(dayValue) {
    return this.get("currentController").daySchedule(dayValue).length;
  },

  nextWeekCount: function() {
    return this.get("currentController").nextWeek().length;
  },

  afterNextWeekCount: function() {
    return this.get("currentController").afterNextWeek().length;
  },

  allCount: function() {
    return this.get("currentController.allScheduled.length");
  },

  actions: {
    change() {
      const changeAction = this.get("on-change");
      const selectedIndex = this.$("select").prop("selectedIndex");
      const selectedValue = this.get("weekDays")[selectedIndex];
      this.set("selectedValue", selectedValue);
      changeAction(selectedValue);
    }
  }
});
