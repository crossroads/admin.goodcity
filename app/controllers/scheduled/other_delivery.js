import { computed } from "@ember/object";
import scheduleController from "./collection";

export default scheduleController.extend({
  allScheduled: computed("dropOff.[]", {
    get: function() {
      return this.get("dropOff");
    },
    set: function(key, value) {
      return value;
    }
  })
});
