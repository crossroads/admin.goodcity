import Ember from "ember";
import AjaxPromise from "../utils/ajax-promise";
import config from "../config/environment";
import _ from "lodash";

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
    const twilioToken = this.get("twilioToken");

    if (!twilioToken) {
      console.log("TwilioToken empty. Cannot proceed with initialization.");
      return;
    }
    this.get("isCordovaApp")
      ? this.initTwilioMobileDevice()
      : this.initTwilioBrowser();
  },

  initTwilioMobileDevice: function() {
    const twilioDevice = this.get("twilio_device");
    const twilioToken = this.get("twilioToken");

    // ensure mobile device permissions are granted prior to library initialization
    const permissions = _.get(window, "cordova.plugins.permissions");
    permissions.requestPermission(
      permissions.RECORD_AUDIO,
      status => {
        if (status.hasPermission) {
          twilioDevice.initialize(twilioToken);
        } else {
          console.log(
            "Audio permissions not granted. Not instantiating Twilio SDK."
          );
        }
      },
      () => {
        console.log(
          "Audio permissions not granted. Not instantiating Twilio SDK."
        );
      }
    );

    twilioDevice.error(() => {
      if (!this.get("isDestroying")) {
        this.set("activeCall", false);
        this.get("internetCallStatus").set("activeCall", false);
      }
      this.get("twilio_device").disconnect();
    });

    twilioDevice.calldiddisconnect(() => {
      this.set("activeCall", false);
      this.get("internetCallStatus").set("activeCall", false);
    });
  },

  initTwilioBrowser: function() {
    const twilioDevice = this.get("twilio_device");
    const twilioToken = this.get("twilioToken");

    twilioDevice.setup(twilioToken, { debug: true });
    twilioDevice.on("error", () => {
      if (!this.get("isDestroying")) {
        this.set("activeCall", false);
        this.get("internetCallStatus").set("activeCall", false);
      }
      this.get("twilio_device").disconnectAll();
    });

    twilioDevice.on("disconnect", () => {
      this.set("activeCall", false);
      this.get("internetCallStatus").set("activeCall", false);
    });
  },

  actions: {
    makeCall() {
      const params = this.get("offerId") + "#" + this.get("currentUserId");
      const twilioToken = this.get("twilioToken");
      const twilioDevice = this.get("twilio_device");
      this.set("activeCall", true);
      this.get("internetCallStatus").set("activeCall", true);
      this.get("isCordovaApp")
        ? twilioDevice.call(twilioToken, { To: params })
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
        this.initTwilioDeviceBindings();
        this.get("internetCallStatus").set(
          "twilio_device",
          this.get("twilio_device")
        );
        this.get("internetCallStatus").set("donorName", this.get("donorName"));
      });
    }
  }
});
