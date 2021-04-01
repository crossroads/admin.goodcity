import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
  name: attr("string"),
  nameEn: attr("string"),
  nameZhTw: attr("string"),
  content: attr("string"),
  contentEn: attr("string"),
  contentZhTw: attr("string"),
  guid: attr("string"),
  isPrivate: attr("boolean")
});
