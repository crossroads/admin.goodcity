import Ember from "ember";
import { translationMacro as t } from "ember-i18n";

export default Ember.Component.extend({
  disabled: false,
  placeholderText: t("reject.message_placeholder"),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),
  attributeBindings: ["value"],

  valueChanged: Ember.observer("rejectMessage", function() {
    this.get("setMessage")(this.get("rejectMessage"));
  }),

  rejectMessage: Ember.computed("selectedId", {
    get: function() {
      let reasonRecord = this.get("store").peekRecord(
        "rejection_reason",
        this.get("selectedId")
      );
      let reason = reasonRecord && reasonRecord.get("name");
      let message = "";

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
    let item = this.get("store").peekRecord("item", this.get("itemId"));
    this.set("rejectMessage", item.get("rejectionComments"));
  }
});
