import DS from "ember-data";
import Ember from "ember";
import { belongsTo } from "ember-data/relationships";

var attr = DS.attr;

export default DS.Model.extend({
  building: attr("string"),
  area: attr("string"),
  name: Ember.computed("building", "area", function() {
    return this.get("building") + this.get("area");
  })
});
