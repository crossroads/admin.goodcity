import dashboard from "./index";
import Ember from "ember";

export default dashboard.extend({
  selfReview: true,
  priority: true,
  isMyActiveOfferPage: true,

  offersCount: Ember.computed.alias("model.offersCount")
});
