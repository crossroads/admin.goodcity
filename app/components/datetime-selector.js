import Ember from "ember";

export default Ember.Component.extend({
  selectedDate: Ember.computed("selectedDateTime", function() {
    if (this.get("selectedDateTime")) {
      return moment(this.get("selectedDateTime")).format("DD/MM/YYYY");
    }
  }),

  selectedTime: Ember.computed("selectedDateTime", "selectedDate", function() {
    if (this.get("selectedDateTime")) {
      let date = new Date(this.get("selectedDateTime")).toLocaleString(
        "en-US",
        { timeZone: "Asia/Hong_Kong" }
      );
      return moment(date).format("HH:mm");
    } else if (this.get("selectedDate")) {
      return "20:00";
    } else {
      return undefined;
    }
  }),

  stopSharingObserver: Ember.observer(
    "selectedTime",
    "selectedDate",
    function() {
      let pattern = /(\d{2})\/(\d{2})\/(\d{4})/;

      if (typeof this.get("selectedDate") === "string") {
        let date = this.get("selectedDate").replace(pattern, "$3/$2/$1");
        if (date) {
          this.set(
            "selectedDateTime",
            `${date} ${this.get("selectedTime")} HKT`
          );
        } else {
          this.set("selectedTime", undefined);
          this.set("selectedDateTime", undefined);
        }
      }
    }
  ),

  actions: {
    // Remove when Ember is upgraded to >= 3.0
    updateErrorMessage() {
      return false;
    }
  }
});
