import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { getOwner } from "@ember/application";

export default Component.extend({
  displayUserPrompt: false,
  holidayName: "",
  invalidName: false,
  invalidDate: false,
  selectedDate: "",
  store: service(),

  actions: {
    displayAddHolidayForm() {
      this.set("displayUserPrompt", true);
    },

    resetForm() {
      this.set("holidayName", "");
      this.set("selectedDate", "");
      this.set("invalidName", false);
      this.set("invalidDate", false);
    },

    addHoliday() {
      this.set("invalidName", false);
      this.set("invalidDate", false);
      var name = this.get("holidayName");
      var date = this.get("selectedDate");

      if (name.trim().length === 0) {
        this.set("invalidName", true);
        return false;
      }

      if (date.toString().trim().length === 0) {
        this.set("invalidDate", true);
        return false;
      }

      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();

      var holiday = this.get("store").createRecord("holiday", {
        name: name,
        holiday: date
      });

      holiday
        .save()
        .catch(error => {
          holiday.unloadRecord();
          throw error;
        })
        .finally(() => {
          this.set("displayUserPrompt", false);
          loadingView.destroy();
          this.send("resetForm");
        });
    }
  }
});
