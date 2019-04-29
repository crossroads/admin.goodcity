import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.sortProperties = ["unreadMessagesCount:desc", "submittedAt:desc"];
  },

  arrangedContent: sort("model", "sortProperties"),

  i18n: service(),

  pageTitle: computed(function() {
    return this.get("i18n").t("inbox.new_offers");
  }),

  allOffers: computed(function() {
    return this.store.peekAll("offer");
  }),

  model: computed("allOffers.@each.state", function() {
    return this.get("allOffers").filterBy("isSubmitted");
  })
});
