import { computed } from "@ember/object";
import Mixin from "@ember/object/mixin";

export default Mixin.create({
  history: [],

  hasHistory: computed("history.length", function() {
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
          this.transitionToRoute("my_list");
        }
      } else {
        this.transitionToRoute(path);
      }
    }
  }
});
