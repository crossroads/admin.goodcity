import Route from "@ember/routing/route";
import { getOwner } from "@ember/application";

export default Route.extend({
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
