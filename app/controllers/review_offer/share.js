import Ember from "ember";
import AsyncTasksMixin from "../../mixins/async_tasks";

export default Ember.Controller.extend(AsyncTasksMixin, {
  store: Ember.inject.service(),
  offerService: Ember.inject.service(),
  parentController: Ember.inject.controller("review_offer"),
  offer: Ember.computed.alias("parentController.offer"),
  isShared: Ember.computed.alias("parentController.isShared"),
  offerShareable: Ember.computed.alias("parentController.offerShareable")
});
