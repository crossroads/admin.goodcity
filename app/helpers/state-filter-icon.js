import Ember from "ember";
import { STATE_FILTERS } from "../services/filter-service";

const {
  PRIORITY,
  PUBLISHED,
  NEW,
  REVIEWING,
  REVIEWED,
  SCHEDULED,
  RECEIVING,
  RECEIVED,
  CANCELLED,
  INACTIVE
} = STATE_FILTERS;

const STATE_ICONS = {
  [NEW]: "shopping-basket",
  [REVIEWING]: "list-ol",
  [REVIEWED]: "hourglass-half",
  [SCHEDULED]: "clock-o",
  [RECEIVING]: "shopping-cart",
  [RECEIVED]: "thumbs-up",
  [CANCELLED]: "thumbs-down",
  [INACTIVE]: "bed",
  [PRIORITY]: "warning",
  [PUBLISHED]: "eye"
};

export default Ember.Helper.helper(function(state) {
  return STATE_ICONS[state[0]] || "";
});
