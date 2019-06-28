import Ember from "ember";

export default Ember.Helper.helper(function(type) {
  switch (type[0]) {
    case "new":
      return "shopping-basket";
    case "under_review":
      return "list-ol";
    case "reviewed":
      return "hourglass-half";
    case "scheduled":
      return "clock-o";
    case "receiving":
      return "shopping-cart";
    case "received":
    case "shipment":
      return "thumbs-up";
    case "cancelled":
      return "thumbs-down";
    case "inactive":
      return "bed";
    case "showPriority":
      return "warning";
    default:
      return "";
  }
});
