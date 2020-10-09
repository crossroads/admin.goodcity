import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  isEditing: false,
  selectedDate: Ember.computed.alias("day.holiday"),

  actions: {
    removeHoliday(holiday) {
      this.get("messageBox").custom(
        this.get("i18n").t("holiday.delete_confirm"),
        this.get("i18n").t("yes"),
        () => {
          var loadingView = getOwner(this)
            .lookup("component:loading")
            .append();

          holiday.deleteRecord();
          holiday
            .save()
            .catch(error => {
              holiday.rollbackAttributes();
              throw error;
            })
            .finally(() => loadingView.destroy());
        },
        this.get("i18n").t("no")
      );
    },

    displayEditForm() {
      this.set("isEditing", true);
    },

    hideEditForm() {
      this.get("day").rollbackAttributes();
      this.set("isEditing", false);
    },

    saveHoliday() {
      var holiday = this.get("day");

      if (holiday.get("name").length !== 0) {
        var loadingView = getOwner(this)
          .lookup("component:loading")
          .append();

        holiday
          .save()
          .catch(error => {
            holiday.rollbackAttributes();
            throw error;
          })
          .finally(() => {
            loadingView.destroy();
            this.set("isEditing", false);
          });
      }
    }
  }
});
