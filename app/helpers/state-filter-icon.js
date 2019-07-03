import Ember from "ember";
import { STATE_FILTERS } from "../services/filter-service";

const {
  PRIORITY,
  NEW,
  REVIEWING,
  REVIEWED,
  SCHEDULED,
  RECEIVING,
  RECEIVED,
  CANCELLED,
  INACTIVE
} = STATE_FILTERS;

export default Ember.Helper.helper(function(type) {
  switch (type[0]) {
    case NEW:
      return "shopping-basket";
    case REVIEWING:
      return "list-ol";
    case REVIEWED:
      return "hourglass-half";
    case SCHEDULED:
      return "clock-o";
    case RECEIVING:
      return "shopping-cart";
    case RECEIVED:
    case "shipment":
      return "thumbs-up";
    case CANCELLED:
      return "thumbs-down";
    case INACTIVE:
      return "bed";
    case PRIORITY:
      return "warning";
    default:
      return "";
  }
});
