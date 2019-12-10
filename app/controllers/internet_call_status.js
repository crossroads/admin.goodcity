import Controller from "@ember/controller";
import config from "../config/environment";

export default Controller.extend({
  isCordovaApp: config.cordova.enabled,
  activeCall: false,
  twilio_device: {},
  donorName: null,

  actions: {
    hangupCall() {
      const twilioDevice = this.get("twilio_device");
      this.set("activeCall", false);
      this.get("isCordovaApp")
        ? twilioDevice.disconnect()
        : twilioDevice.disconnectAll();
    }
  }
});
