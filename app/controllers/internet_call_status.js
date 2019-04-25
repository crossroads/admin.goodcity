import Controller from "@ember/controller";

export default Controller.extend({
  activeCall: false,
  twilio_device: {},
  donorName: null,

  actions: {
    hangupCall() {
      this.set("activeCall", false);
      return this.get("twilio_device").disconnectAll();
    }
  }
});
