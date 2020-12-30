import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
  nameEn: attr("string"),
  nameZhTw: attr("string"),
  descriptionEn: attr("string"),
  descriptionZhTw: attr("string")
});
