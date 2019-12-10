import Controller from "@ember/controller";

export default Controller.extend({
  queryParams: ["applyStateFilter", "applyTimeFilter"],
  applyStateFilter: null,
  applyTimeFilter: null
});
