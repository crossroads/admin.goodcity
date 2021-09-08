import MessagesBaseController from "goodcity/controllers/message_base_controller";

export default MessagesBaseController.extend({
  displayCannedMessages: true,

  offerResponse: Ember.computed(
    "allMessages.[]",
    "allMessages.@each.recipientId",
    "recipientId",
    function() {
      return this.store
        .peekAll("offerResponse")
        .filter(
          m =>
            m.get("userId") == this.get("recipientId") &&
            m.get("offerId") == this.get("offer.id")
        );
    }
  ),

  messages: Ember.computed(
    "allMessages.[]",
    "allMessages.@each.recipientId",
    "offerResponse",
    "recipientId",
    function() {
      var offerResponse = this.get("offerResponse");
      return this.get("allMessages").filterBy(
        "messageableId",
        offerResponse.get("firstObject").id
      );
    }
  ),
  actions: {
    leave() {
      this.replaceRoute("review_offer.share");
    },
    sendMessage() {
      // To hide soft keyboard
      Ember.$("textarea").trigger("blur");
      var offerResponse = this.get("offerResponse");
      this.set("inProgress", true);
      var values = this.getProperties("body", "isPrivate");
      values.messageableId = offerResponse.get("firstObject").id;
      values.messageableType = "OfferResponse";
      values.createdAt = new Date();
      values.sender = this.store.peekRecord(
        "user",
        this.get("session.currentUser.id")
      );

      values.recipientId = this.get("recipientId");

      var message = this.store.createRecord("message", values);
      message
        .save()
        .then(() => {
          this.set("body", "");
        })
        .catch(error => {
          this.store.unloadRecord(message);
          throw error;
        })
        .finally(() => this.set("inProgress", false));

      Ember.$("body").animate({ scrollTop: Ember.$(document).height() }, 1000);
    }
  }
});
