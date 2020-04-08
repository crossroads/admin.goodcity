import Ember from "ember";

export default Ember.Mixin.create({
  history: [],

  hasHistory: Ember.computed("history.length", function() {
    return this.get("history.length") > 1;
  }),

  actions: {
    togglePath(path) {
      this.get("history").pushObject(this.get("currentPath"));

      if (this.get("target.currentPath") === path) {
        if (this.get("hasHistory")) {
          this.get("history").popObject();
          window.history.back();
        } else {
          this.transitionToRoute("dashboard");
        }
      } else {
        this.transitionToRoute(path);
      }
    }
  }
});
