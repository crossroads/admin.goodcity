import Controller from "@ember/controller";

export default Controller.extend({
  activeCall: false,
  donorName: null,

  init() {
    this._super(...arguments);
    this.twilio_device = {};
  },

  actions: {
    hangupCall() {
      this.set("activeCall", false);
      return this.get("twilio_device").disconnectAll();
    }
  }
});
