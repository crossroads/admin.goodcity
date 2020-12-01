import Ember from "ember";
import MessagesBaseController from "goodcity/controllers/message_base_controller";

export default MessagesBaseController.extend({
  review_item: Ember.inject.controller("review_item"),
  item: Ember.computed.alias("review_item.model"),
  displayCannedMessages: true
});
