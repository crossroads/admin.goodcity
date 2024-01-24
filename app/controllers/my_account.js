import Ember from "ember";

export default Ember.Controller.extend({
  user: Ember.computed.alias("model.user"),

  actions: {
    deleteAccount() {
      this.transitionToRoute("delete_account");
    }
  }
});
