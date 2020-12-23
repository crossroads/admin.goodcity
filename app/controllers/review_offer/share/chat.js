import MessagesBaseController from "goodcity/controllers/message_base_controller";

export default MessagesBaseController.extend({
  displayCannedMessages: true,

  actions: {
    leave() {
      this.replaceRoute("review_offer.share");
    }
  }
});
