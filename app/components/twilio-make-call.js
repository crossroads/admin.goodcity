import Ember from "ember";
import AjaxPromise from "../utils/ajax-promise";
import config from "../config/environment";

export default Ember.Component.extend({
  mobile: null,
  offerId: null,
  twilioToken: null,
  activeCall: false,
  donorName: null,
  isCordovaApp: config.cordova.enabled,
  hidden: Ember.computed.empty("mobile"),
  currentUserId: Ember.computed.alias("session.currentUser.id"),
  internetCallStatus: {},
  logger: Ember.inject.service(),

  outputSources: {},

  hasTwilioSupport: Ember.computed(
    "hasTwilioBrowserSupport",
    "isCordovaApp",
    function() {
      return this.get("isCordovaApp") || this.get("hasTwilioBrowserSupport");
    }
  ),

  hasTwilioBrowserSupport: Ember.computed(function() {
    var hasWebRtcSupport = !!window.webkitRTCPeerConnection; // twilio js doesn't use mozRTCPeerConnection
    var hasFlashSupport = !!(
      navigator.plugins["Shockwave Flash"] ||
      (window.ActiveXObject &&
        new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash"))
    );

    return hasWebRtcSupport || hasFlashSupport;
  }),

  twilio_device: Ember.computed(function() {
    return this.get("isCordovaApp") ? Twilio.TwilioVoiceClient : Twilio.Device;
  }),

  initTwilioDeviceBindings: function() {
    const twilio_token = this.get("twilioToken");
    const twilio_device = this.get("twilio_device");

    twilio_device.setup(twilio_token, {
      debug: true
    });

    twilio_device.error(() => {
      if (!this.get("isDestroying")) {
        this.set("activeCall", false);
      }
      this.get("twilio_device").disconnectAll();
    });

    twilio_device.disconnect(() => {
      if (!this.isDestroying && !this.isDestroyed) {
        this.set("activeCall", false);
        this.get("internetCallStatus").set("activeCall", false);
      }
    });
  },

  audioDeviceAccessPrompt() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then(function(mediaStream) {
        this.get("outputSources").set("optional", [
          { sourceId: mediaStream.id }
        ]);
      })
      .catch(error => {
        this.get("logger").error(e);
      });
  },

  actions: {
    makeCall() {
      const params = this.get("offerId") + "#" + this.get("currentUserId");
      const accessToken = this.get("twilioToken");
      const twilioDevice = this.get("twilio_device");
      this.set("activeCall", true);
      this.get("internetCallStatus").set("activeCall", true);
      this.get("isCordovaApp")
        ? twilioDevice.call(accessToken, params)
        : twilioDevice.connect({ To: params });
    },

    hangupCall() {
      const twilioDevice = this.get("twilio_device");
      this.set("activeCall", false);
      this.get("internetCallStatus").set("activeCall", false);
      this.get("isCordovaApp")
        ? twilioDevice.disconnect()
        : twilioDevice.disconnectAll();
    }
  },

  didInsertElement() {
    if (this.get("hasTwilioSupport")) {
      this._super();
      new AjaxPromise(
        "/twilio_outbound/generate_call_token",
        "GET",
        this.get("session.authToken")
      ).then(data => {
        this.set("twilioToken", data["token"]);
        this.get("isCordovaApp")
          ? this.audioDeviceAccessPrompt()
          : this.initTwilioDeviceBindings();
        this.get("internetCallStatus").set(
          "twilio_device",
          this.get("twilio_device")
        );
        this.get("internetCallStatus").set("donorName", this.get("donorName"));
      });
    }
  }
});
