import Ember from "ember";

export default Ember.Component.extend({
  selectedDate: "",
  selectedTime: "",

  setDate() {
    if (
      this.get("selectedDateTime") &&
      typeof this.get("selectedDateTime") !== "string"
    ) {
      return this.set(
        "selectedDate",
        moment(this.get("selectedDateTime")).format("DD/MM/YYYY")
      );
    }
  },

  setTime() {
    if (
      this.get("selectedDateTime") &&
      typeof this.get("selectedDateTime") !== "string"
    ) {
      let date = new Date(this.get("selectedDateTime")).toLocaleString(
        "en-US",
        { timeZone: "Asia/Hong_Kong" }
      );
      this.set("selectedTime", moment(date).format("HH:mm"));
    }
  },

  init() {
    this._super(...arguments);
    this.setDate();
    this.setTime();
  },

  invalidDateTime: Ember.computed("selectedDateTime", function() {
    return !this.get("selectedDateTime");
  }),

  selectedDateTime: Ember.computed("selectedTime", "selectedDate", {
    get() {
      if (typeof this.get("selectedDate") === "string") {
        let pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        let date = this.get("selectedDate").replace(pattern, "$3/$2/$1");
        let time = this.get("selectedTime") || "23:59";

        if (date) {
          return `${date} ${time} HKT`;
        }
      }
    },
    set(_, value) {
      return value;
    }
  }),

  actions: {
    // Remove when Ember is upgraded to >= 3.0
    updateErrorMessage() {
      return false;
    }
  }
});
