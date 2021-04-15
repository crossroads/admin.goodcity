import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Component.extend({
  displayUserPrompt: false,
  holidayName: "",
  invalidName: false,
  invalidDate: false,
  selectedDate: "",
  store: Ember.inject.service(),

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

      let isNameEmpty = name.trim().length === 0;
      let isDateEmpty = date.toString().trim().length === 0;

      this.set("invalidName", isNameEmpty);
      this.set("invalidDate", isDateEmpty);

      if (isNameEmpty || isDateEmpty) {
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
