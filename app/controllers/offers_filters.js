import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ["applyStateFilter", "applyTimeFilter"],
  applyStateFilter: null,
  applyTimeFilter: null
});
