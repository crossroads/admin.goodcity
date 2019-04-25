import { computed } from "@ember/object";
import { empty, gte } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Component from "@ember/component";

export default Component.extend({
  tagName: "li",
  classNameBindings: ["hidden"],
  itemId: null,
  pState: null, // experienced initial value of 'inBuffer' on staging if name is state
  store: service(),
  hidden: empty("packages"),
  hasMultiplePackages: gte("packages.length", 2),

  item: computed("itemId", function() {
    return this.get("store").peekRecord("item", this.get("itemId"));
  }),

  packages: computed("pState", "item", "item.packages.@each.state", function() {
    return this.get("item.packages").filterBy("state", this.get("pState"));
  })
});
