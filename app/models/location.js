import { computed } from "@ember/object";
import DS from "ember-data";

var attr = DS.attr;

export default DS.Model.extend({
  building: attr("string"),
  area: attr("string"),

  name: computed("building", "area", function() {
    return this.get("building") + this.get("area");
  })
});
