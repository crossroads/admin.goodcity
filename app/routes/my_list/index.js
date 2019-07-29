import AuthorizeRoute from "./../authorize";
import config from "../../config/environment";

export default AuthorizeRoute.extend({
  isCordovaApp: config.cordova.enabled,

  model() {
    if (!this.get("isCordovaApp") && "Notification" in window) {
      this.requestDesktopNotificationPermission();
    }
    return this.transitionTo("my_list.reviewing");
  },

  requestDesktopNotificationPermission() {
    if (Notification && Notification.permission === "default") {
      Notification.requestPermission(function(permission) {
        if (!("permission" in Notification)) {
          Notification.permission = permission;
        }
      });
    }
  }
});
