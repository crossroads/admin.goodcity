import Ember from "ember";

export default Ember.Service.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  allAvailablePrinter() {
    let availablePrinters = this.get("store").peekAll("printer");
    let printers = [];
    availablePrinters.map(printer => {
      let tag = printer.get("name");
      printers.push({ name: tag, id: printer.get("id") });
    });
    return printers;
  },

  userDefaultPrinter() {
    let currentUserId = this.get("session.currentUser.id");
    return this.get("store")
      .peekRecord("user", currentUserId)
      .get("printer");
  }
});
