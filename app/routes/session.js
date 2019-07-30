import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Route.extend({
  beforeModel() {
    if (this.session.get("isLoggedIn")) {
      var currentUser = this.get("session.currentUser");

      if (currentUser) {
        this.transitionTo("dashboard");
      } else {
        getOwner(this)
          .lookup("route:application")
          ._loadDataStore();
      }
    } else {
      this.transitionTo("login");
    }
  }
});
