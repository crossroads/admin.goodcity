import { later } from "@ember/runloop";
import $ from "jquery";
import { observer } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import config from "../config/environment";
export default Component.extend({
  store: service(),
  isCordovaApp: config.cordova.enabled,

  animateNotification: observer("currentController.model.[]", function() {
    var box = $(".contain-to-grid.notification");
    let notification = this.get("currentController").retrieveNotification();

    if (!notification) {
      box.hide();
      return;
    }

    if (!this.get("isCordovaApp") && "Notification" in window) {
      this.desktopNotification(notification);
    }

    if (box.is(":hidden")) {
      box.slideDown();
      $(".sticky_title_bar").animate(
        {
          top: "5%"
        },
        1000
      );
      later(this, this.removeNotification, notification, 6000);
    }
  }).on("didInsertElement"),

  removeNotification: function(notification) {
    var controller = this.get("currentController");
    if (controller) {
      var remove = function() {
        controller.get("model").removeObject(notification);
      };
      var newNotification = controller.retrieveNotification(1);
      if (newNotification) {
        remove();
        later(this, this.removeNotification, newNotification, 6000);
      } else {
        $(".contain-to-grid.notification").slideUp(1000, remove);
        $(".sticky_title_bar").animate(
          {
            top: "0"
          },
          1000
        );
      }
    }
  },

  desktopNotification: function(data) {
    if (Notification.permission === "granted") {
      var text = data.message;
      if (data.category === "message") {
        let user = this.get("store").peekRecord("user", data.author_id);
        text =
          "New " +
          data.category +
          " from " +
          user.get("firstName") +
          " " +
          user.get("lastName") +
          "\n" +
          data.message;
      }
      this.sendDesktopNotification(text);
    }
  },

  sendDesktopNotification: function(text) {
    let notification = new Notification("Goodcity Admin", {
      icon: "assets/images/icon.png",
      body: text,
      tag: "soManyNotification"
    });
    //'tag' handles muti tab scenario i.e when multiple tabs are open then only
    // only one notification is sent

    notification.onclick = function() {
      parent.focus();
      window.focus(); //just in case, older browsers
      this.close();
    };
    setTimeout(notification.close.bind(notification), 5000);
  }
});
