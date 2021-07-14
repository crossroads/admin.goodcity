import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";

export default Model.extend({
  userId: attr("string"),
  users: belongsTo("user", {
    async: false
  }),
  offerId: attr("string"),
  offer: belongsTo("offer", { async: false }),
  messages: hasMany("message", {
    async: false
  })
});
