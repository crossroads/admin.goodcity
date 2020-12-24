import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default Model.extend({
  organisationId: attr("string"),
  organisation: belongsTo("organisation", { async: false }),
  userId: attr("string"),
  user: belongsTo("user", { async: false }),
  position: attr("string"),
  status: attr("string")
});
