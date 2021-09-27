import Ember from "ember";

export default Ember.Component.extend({
  store: Ember.inject.service(),

  allMessages: Ember.computed(function() {
    return this.get("store").peekAll("message");
  }),

  messageThreads: Ember.computed(
    "offer",
    "offer.id",
    "allMessages.[]",
    "allMessages.length",
    "allMessages.@each.{senderId,recipientId}",
    function() {
      var unreadMessageCount = this.get("offer.unreadMessagesCount")
        ? this.get("offer.unreadMessagesCount")
        : 0;
      let offerResponse = this.get("store")
        .peekAll("offerResponse")
        .filterBy("offerId", this.get("offer.id"));

      offerResponse.uniq().map(uid => {
        let messages = this.get("allMessages").filter(
          m =>
            m.get("messageableType") === "OfferResponse" &&
            m.get("messageableId") === uid.id
        );

        unreadMessageCount += messages.reduce((sum, m) => {
          return sum + (m.get("isUnread") ? 1 : 0);
        }, 0);
      });

      return unreadMessageCount;
    }
  )
});
