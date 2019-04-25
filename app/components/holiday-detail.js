import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { getOwner } from "@ember/application";

export default Component.extend({
  i18n: service(),
  messageBox: service(),
  isEditing: false,
  selectedDate: alias("day.holiday"),

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
              holiday.rollback();
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
            holiday.rollback();
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
