import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { translationMacro as t } from "ember-i18n";

export default Component.extend({
  disabled: false,
  placeholderText: t("reject.message_placeholder"),
  i18n: service(),
  store: service(),

  rejectMessage: computed("selectedId", {
    get: function() {
      var reasonRecord = this.get("store").peekRecord(
        "rejection_reason",
        this.get("selectedId")
      );
      var reason = reasonRecord && reasonRecord.get("name");
      var message = "";

      switch (reason) {
        case this.get("i18n").t("reject.quality").string:
          message =
            this.get("i18n").t("reject.reject_message") +
            this.get("i18n").t("reject.quality_message");
          break;
        case this.get("i18n").t("reject.size").string:
          message =
            this.get("i18n").t("reject.reject_message") +
            this.get("i18n").t("reject.size_message");
          break;
        case this.get("i18n").t("reject.supply").string:
          message = this.get("i18n").t("reject.supply_message");
          break;
      }

      if (this.get("selectedId") === "-1") {
        message = this.get("i18n").t("reject.reject_message");
      }
      return message;
    },
    set: function(key, value) {
      return value;
    }
  }),

  actions: {
    clearRejectMessage() {
      this.set("rejectMessage", "");
    }
  },

  didInsertElement: function() {
    var item = this.get("store").peekRecord("item", this.get("itemId"));
    this.set("rejectMessage", item.get("rejectionComments"));
  }
});
