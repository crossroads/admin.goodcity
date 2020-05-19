import AuthorizeRoute from "./../authorize";

export default AuthorizeRoute.extend({
  model() {
    var itemId = this.modelFor("review_item").item.get("id");
    return this.store.peekRecord("item", itemId);
  },

  setupController(controller, model) {
    this._super(controller, model);
    if (!model.get("isRejected")) {
      controller.set("selectedId", undefined);
      controller.set("rejectReason", undefined);
      controller.set("rejectMsg", "");
    }
  }
});
