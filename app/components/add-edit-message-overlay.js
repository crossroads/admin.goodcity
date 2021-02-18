import Ember from "ember";
import _ from "lodash";

export default Ember.Component.extend({
  messageService: Ember.inject.service(),
  store: Ember.inject.service(),

  actions: {
    createCannedMessage() {
      const response = this.get("store").createRecord("canned-response", {
        name: this.get("label"),
        nameEn: this.get("label"),
        content: this.get("message"),
        contentEn: this.get("label")
      });
      response.save().then(() => {
        console.log("saved");
        this.set("messageService.isAddMessageVisible", false);
      });
    },

    closeOverlay() {
      this.set("messageService.isAddMessageVisible", false);
    }
  }
});
