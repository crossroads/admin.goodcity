import MessagesBaseRoute from "../../message_base";

export default MessagesBaseRoute.extend({
  async model({ user_id }) {
    this.set("userId", user_id);
    let offerResponse = await this.store.query("offerResponse", {
      offer_response: { user_id: user_id, offer_id: this.modelFor("offer").id }
    });
    return this.store.query("message", {
      messageable_type: "OfferResponse",
      messageable_id: offerResponse.content[0].id
    });
  },

  setupController(controller, recipient) {
    this._super(controller, recipient);
    controller.set("recipient", recipient);
    controller.set("recipientId", this.get("userId"));
    controller.set("offer", this.modelFor("offer"));
  }
});
