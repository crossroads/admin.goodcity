import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";
import backNavigator from "./../mixins/back_navigator";

export default Controller.extend(backNavigator, {
  messages: service(),

  unreadMessageCount: alias("messages.unreadMessageCount"),

  hasMessages: computed("unreadMessageCount", function() {
    return this.get("unreadMessageCount") > 0;
  }),

  actions: {
    displayNotification() {
      this.send("togglePath", "my_notifications");
    }
  }
});
