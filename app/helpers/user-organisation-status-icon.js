import Ember from "ember";

const STATE_ICONS = {
  pending: "fa-pause-circle",
  approved: "fa-check-circle",
  expired: "fa-times-circle",
  denied: "fa-times-circle"
};

export default Ember.Helper.helper(function(state) {
  return STATE_ICONS[state] || "";
});
