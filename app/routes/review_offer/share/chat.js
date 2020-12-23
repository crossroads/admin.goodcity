import MessagesBaseRoute from "../../message_base";

export default MessagesBaseRoute.extend({
  setupController(controller, recipient) {
    this._super(controller, recipient);
    controller.set("recipient", recipient);
    controller.set("recipientId", recipient.get("id"));
    controller.set("offer", this.modelFor("offer"));
  }
});
