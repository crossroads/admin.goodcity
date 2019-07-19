import AuthorizeRoute from "./../authorize";
import AjaxPromise from "./../../utils/ajax-promise";

export default AuthorizeRoute.extend({
  model() {
    return new AjaxPromise(
      "/offers/summary",
      "GET",
      this.get("session.authToken")
    );
  }
});
