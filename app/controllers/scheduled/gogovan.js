import { computed } from "@ember/object";
import scheduleController from "./collection";

export default scheduleController.extend({
  allScheduled: computed("ggv.[]", {
    get: function() {
      return this.get("ggv");
    },
    set: function(key, value) {
      return value;
    }
  })
});
