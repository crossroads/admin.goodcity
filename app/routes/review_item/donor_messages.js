import AuthorizeRoute from "goodcity/routes/authorize";

export default AuthorizeRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);
    controller.set("isActive", true);
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set("isActive", false);
    }
  },
  renderTemplate() {
    this.render("message_template", {
      controller: "review_item.donor_messages"
    });
  },

  afterModel() {
    var itemId = this.modelFor("review_item").get("id");
    this.store.query("version", { item_id: itemId, for_item: true });
  }
});
