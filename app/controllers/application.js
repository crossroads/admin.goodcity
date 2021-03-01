import config from "../config/environment";

export default Ember.Controller.extend({
  cordova: Ember.inject.service(),
  subscriptions: Ember.inject.controller(),
  messageService: Ember.inject.service(),
  isMobileApp: config.cordova.enabled,
  config,

  app_id: config.APP.ANDROID_APP_ID,
  ios_app_id: config.APP.IOS_APP_ID,
  appTitle: config.APP.TITLE,
  bannerImage: config.APP.BANNER_IMAGE,

  initSubscriptions: Ember.on("init", function() {
    if (this.session.get("isLoggedIn")) {
      this.send("setSubscriptions");
    }
  }),

  supportGCLink: Ember.computed("session.language", function() {
    return this.get("session.language") === "zh-tw"
      ? "https://www.crossroads.org.hk/zh-hant/home/donate-funds/"
      : "https://www.crossroads.org.hk/home/donate-funds/";
  }),

  appVersion: Ember.computed(function() {
    return config.cordova.enabled ? config.APP.VERSION : null;
  }),

  actions: {
    logMeOut() {
      this.session.clear(); // this should be first since it updates isLoggedIn status
      this.get("subscriptions").send("unwire");
      this.get("subscriptions").send("unloadNotifications");
      this.store.unloadAll();
      var _this = this;
      config.APP.PRELOAD_TYPES.forEach(function(type) {
        _this.store.findAll(type);
      });
      this.transitionToRoute("login");
    },

    logMeIn() {
      this.send("setSubscriptions");
    },

    setSubscriptions() {
      this.get("subscriptions").send("wire");
    },

    rateApp() {
      if (this.get("cordova").isIOS()) {
        this.set("app_id", this.get("ios_app_id"));
      }
      LaunchReview.launch(this.get("app_id"));
    }
  }
});
