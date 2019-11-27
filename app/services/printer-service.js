import Ember from "ember";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Ember.Service.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  allAvailablePrinter() {
    return this.get("store")
      .peekAll("printer")
      .map(printer => printer.getProperties("name", "id"));
  },

  userDefaultPrinter: Ember.computed(function() {
    let currentUserId = this.get("session.currentUser.id");
    return this.get("store")
      .peekRecord("user", currentUserId)
      .get("printer");
  }),

  updateUserDefaultPrinter(printerId) {
    new AjaxPromise(
      `/users/${this.get("session.currentUser.id")}`,
      "PUT",
      this.get("session.authToken"),
      { user: { printer_id: printerId } }
    ).then(data => {
      this.get("store").pushPayload(data);
    });
  }
});
