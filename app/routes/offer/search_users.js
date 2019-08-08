import AuthorizeRoute from "./../authorize";

export default AuthorizeRoute.extend({
  model(params) {
    var offerId = this.modelFor("review_offer").get("id") || params.offer_id;
    return this.store.peekRecord("offer", offerId);
  }
});
