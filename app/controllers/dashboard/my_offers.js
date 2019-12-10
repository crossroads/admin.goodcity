import { alias } from "@ember/object/computed";
import dashboard from "./index";

export default dashboard.extend({
  selfReview: true,
  priority: true,
  isMyActiveOfferPage: true,

  offersCount: alias("model.offersCount")
});
