import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.sortProperties = ["holiday"];
  },

  arrangedContent: sort("model", "sortProperties")
});
