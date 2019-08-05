import AuthorizeRoute from "./../authorize";
// import Ember from "ember";

export default AuthorizeRoute.extend({
  model() {
    var offerId = this.modelFor("review_offer").get("id");
    return this.store.peekRecord("offer", offerId);
  }
});
