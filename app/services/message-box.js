import $ from "jquery";
import Service, { inject as service } from "@ember/service";
import { getOwner } from "@ember/application";

export default Service.extend({
  i18n: service(),

  alert: function(message, callback) {
    this.custom(message, this.get("i18n").t("okay"), callback);
  },

  confirm: function(message, callback) {
    this.custom(
      message,
      this.get("i18n").t("cancel"),
      null,
      this.get("i18n").t("okay"),
      callback
    );
  },

  custom: function(
    message,
    btn1Text,
    btn1Callback,
    btn2Text,
    btn2Callback,
    displayCloseLink
  ) {
    $(document).trigger("cancel-loading-timer");
    $(".loading-indicator").remove();

    var view = getOwner(this)
      .lookup("component:message-box")
      .append();
    view.set("btn1Text", btn1Text);
    view.set("btn1Callback", btn1Callback);
    view.set("btn2Text", btn2Text);
    view.set("btn2Callback", btn2Callback);
    view.set("message", message);
    view.set("displayCloseLink", displayCloseLink);
    view.set("isVisible", true);
  }
});
