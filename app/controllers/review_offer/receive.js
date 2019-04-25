import { filterBy } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  queryParams: ["state"],
  state: "expecting",
  items: filterBy("model.items", "state", "accepted")
});
