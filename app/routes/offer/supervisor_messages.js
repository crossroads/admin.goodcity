import MessagesBaseRoute from "../message_base";

export default MessagesBaseRoute.extend({
  renderTemplate() {
    this.render("offer/donor_messages", {
      controller: "offer.supervisor_messages"
    });
  }
});
