import { helper as buildHelper } from "@ember/component/helper";
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

const STATE_ICONS = {
  [NEW]: "shopping-basket",
  [REVIEWING]: "list-ol",
  [REVIEWED]: "hourglass-half",
  [SCHEDULED]: "clock-o",
  [RECEIVING]: "shopping-cart",
  [RECEIVED]: "thumbs-up",
  [CANCELLED]: "thumbs-down",
  [INACTIVE]: "bed",
  [PRIORITY]: "warning"
};

export default buildHelper(function(state) {
  return STATE_ICONS[state[0]] || "";
});
