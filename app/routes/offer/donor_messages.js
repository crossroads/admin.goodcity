import MessagesBaseRoute from "../message_base";

export default MessagesBaseRoute.extend({
  afterModel() {
    var offerId = this.modelFor("offer").get("id");
    this.store.query("version", { item_id: offerId, for_offer: true });
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set("isActive", false);
    }
  }
});
