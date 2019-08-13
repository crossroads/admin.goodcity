import Ember from "ember";
import backNavigator from "./../mixins/back_navigator";

export default Ember.Controller.extend(backNavigator, {
  messages: Ember.inject.service(),

  unreadMessageCount: Ember.computed.alias("messages.unreadMessageCount"),

  hasMessages: Ember.computed("unreadMessageCount", function() {
    return this.get("unreadMessageCount") > 0;
  }),

  actions: {
    displayNotification() {
      this.send("togglePath", "my_notifications");
    }
  }
});
