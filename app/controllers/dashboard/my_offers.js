import dashboard from "./index";
import Ember from "ember";

export default dashboard.extend({
  queryParams: ["selfReviewer"],
  selfReviewer: false,
  selfReview: true,
  priority: true
});
