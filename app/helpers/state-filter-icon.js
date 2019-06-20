import Ember from "ember";

export default Ember.Helper.helper(function(type) {
  switch (type[0]) {
    case "new":
      return "thumbs-up";
    case "reviewing":
      return "thumbs-up";
    case "reviewed":
      return "thumbs-up";
    case "scheduled":
      return "thumbs-up";
    case "receiving":
      return "thumbs-up";
    case "received":
    case "shipment":
      return "thumbs-up";
    case "cancelled":
      return "thumbs-up";
    case "inactive":
      return "thumbs-up";
    default:
      return "";
  }
});
