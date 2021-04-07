import Model from "ember-data/model";
import attr from "ember-data/attr";
import Ember from "ember";

export default Model.extend({
  name: attr("string"),
  nameEn: attr("string"),
  nameZhTw: attr("string"),
  content: attr("string"),
  contentEn: attr("string"),
  contentZhTw: attr("string"),
  guid: attr("string"),
  messageType: attr("string"),
  isPrivate: Ember.computed(function() {
    return this.get("messageType") === "SYSTEM";
  })
});
