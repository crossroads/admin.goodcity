/* jshint node: true */
const pkgJson = require("../package.json");
module.exports = function(environment) {
  environment = process.env.ENVIRONMENT || environment || "development";
  var ENV = {
    modulePrefix: "goodcity",
    environment: environment,
    baseURL: "/",
    defaultLocationType: "auto",

    emberRollbarClient: {
      enabled: environment !== "test" && environment !== "development",
      accessToken: "e0c3ee33bdc049fbbdecbad844c552da",
      verbose: true,
      ignoredMessages: ["TransitionAborted"],
      payload: {
        environment: environment,
        client: {
          javascript: {
            // Optionally have Rollbar guess which frames the error was thrown from
            // when the browser does not provide line and column numbers.
            guess_uncaught_frames: false
          }
        }
      }
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    contentSecurityPolicy: {
      "img-src":
        "'self' data: https://res.cloudinary.com filesystem: * https://goodcityimages.blob.core.windows.net",
      "style-src": "'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com",
      "font-src": "'self' data: https://maxcdn.bootstrapcdn.com",
      "media-src":
        "'self' data: https://api.twilio.com http://api.twilio.com http://static.twilio.com https://static.twilio.com",
      "object-src": "'self'",
      "script-src":
        "'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      NAME: "admin.goodcity",
      TITLE: "Admin",
      IOS_APP_ID: "1013288708",
      ANDROID_APP_ID: "hk.goodcity.admin",
      BANNER_IMAGE: "assets/images/admin.png",
      CLOUD_NAME: "ddoadcjjl",
      CLOUD_API_KEY: 926849638736153,
      CLOUD_URL: "https://api.cloudinary.com/v1_1/ddoadcjjl/auto/upload",
      IMAGE_PATH: "http://res.cloudinary.com/ddoadcjjl/image/upload/",
      HK_COUNTRY_CODE: "+852",
      GOGOVAN_CONTACT: "3590 3399",
      CROSSROADS_CONTACT: "2984 9309",
      GMAP_URL:
        "https://www.google.com.hk/maps/place/22%C2%B022'27.9%22N+113%C2%B059'36.1%22E/@22.3744154,113.9758515,14z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0",
      // RESTAdapter Settings
      NAMESPACE: "api/v1",
      OTP_RESEND_TIME: 60,
      NAMESPACE_V2: "api/v2",

      PRELOAD_TYPES: ["territory"],
      PRELOAD_AUTHORIZED_TYPES: [
        "package_type",
        "donor_condition",
        "rejection_reason",
        "role",
        "timeslot",
        "gogovan_transport",
        "crossroads_transport",
        "location",
        "cancellation_reason",
        "holiday",
        "printer"
      ],
      SHA: process.env.APP_SHA,
      SHARED_SHA: process.env.APP_SHARED_SHA,
      VERSION: pkgJson.version
    },

    cordova: {
      enabled: process.env.EMBER_CLI_CORDOVA !== "0",
      rebuildOnChange: false,
      emulate: false
    },
    coffeeOptions: {
      blueprints: false
    },

    i18n: {
      defaultLocale: "en"
    }
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = "http://localhost:3000";
    ENV.APP.SOCKETIO_WEBSERVICE_URL = "http://localhost:1337/goodcity";
    ENV.ADMIN_APP_HOST_URL = "http://localhost:4201";
    ENV.BROWSE_APP_HOST_URL = "http://localhost:4202";
    ENV.APP.STOCK_APP_HOST_URL = "http://localhost:4203";
    ENV.APP.STOCK_ANDROID_APP_HOST_URL = "stock-staging.goodcity.hk"; //Added for localhost replacement
    ENV.APP.GOODCITY_NUMBER = "+85230015405";

    ENV.contentSecurityPolicy["connect-src"] = [
      "https://api.rollbar.com",
      "http://localhost:4201",
      "http://localhost:3000",
      "http://localhost:1337",
      "ws://localhost:1337",
      "wss://localhost:1337",
      "https://api.cloudinary.com",
      "https://static.twilio.com",
      "https://api.twilio.com",
      "https://media.twiliocdn.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com",
      "https://www.google-analytics.com"
    ].join(" ");
  }

  if (environment === "test") {
    ENV.cordova.enabled = false;
    // Testem prefers this...
    ENV.baseURL = "/";
    ENV.locationType = "auto";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";

    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = "http://localhost:4201";
    ENV.ADMIN_APP_HOST_URL = "http://localhost:4201";
  }

  if (environment === "production") {
    if (!process.env.ENVIRONMENT)
      throw "Please pass an appropriate ENVIRONMENT=(staging|production) param.";
    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = "https://api.goodcity.hk";
    ENV.ADMIN_APP_HOST_URL = "https://admin.goodcity.hk";
    ENV.BROWSE_APP_HOST_URL = "https://charities.goodcity.hk";
    ENV.APP.SOCKETIO_WEBSERVICE_URL = "https://socket.goodcity.hk:81/goodcity";
    ENV.APP.STOCK_APP_HOST_URL = "https://stock.goodcity.hk";
    ENV.APP.STOCK_ANDROID_APP_HOST_URL = "stock.goodcity.hk";
    ENV.APP.GOODCITY_NUMBER = "+85230011580";

    ENV.contentSecurityPolicy["connect-src"] = [
      "https://api.rollbar.com",
      "https://admin.goodcity.hk",
      "https://api.goodcity.hk",
      "https://socket.goodcity.hk:81",
      "ws://socket.goodcity.hk:81",
      "wss://socket.goodcity.hk:81",
      "https://api.cloudinary.com",
      "https://static.twilio.com",
      "https://api.twilio.com",
      "https://media.twiliocdn.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com",
      "https://www.google-analytics.com"
    ].join(" ");
    //google analytics
    ENV.googleAnalytics = { webPropertyId: "UA-62978462-2" };
  }

  if (environment === "staging") {
    ENV.APP.API_HOST_URL = "https://api-staging.goodcity.hk";
    ENV.ADMIN_APP_HOST_URL = "https://admin-staging.goodcity.hk";
    ENV.BROWSE_APP_HOST_URL = "https://charities-staging.goodcity.hk";
    ENV.APP.STOCK_APP_HOST_URL = "https://stock-staging.goodcity.hk";
    ENV.APP.STOCK_ANDROID_APP_HOST_URL = "stock-staging.goodcity.hk";
    ENV.APP.SOCKETIO_WEBSERVICE_URL =
      "https://socket-staging.goodcity.hk/goodcity";
    ENV.APP.GOODCITY_NUMBER = "+85230015405";
    ENV.contentSecurityPolicy["connect-src"] = [
      "https://api.rollbar.com",
      "https://admin-staging.goodcity.hk",
      "https://api-staging.goodcity.hk",
      "https://socket-staging.goodcity.hk",
      "ws://socket-staging.goodcity.hk",
      "wss://socket-staging.goodcity.hk",
      "https://api.cloudinary.com",
      "https://media.twiliocdn.com",
      "https://api.twilio.com",
      "https://static.twilio.com",
      "https://api.twilio.com",
      "https://media.twiliocdn.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com",
      "https://www.google-analytics.com"
    ].join(" ");
    ENV.googleAnalytics = { webPropertyId: "UA-62978462-3" };
  }

  ENV.APP.SERVER_PATH = ENV.APP.API_HOST_URL + "/" + ENV.APP.NAMESPACE;
  ENV.APP.SERVER_PATH_V2 = ENV.APP.API_HOST_URL + "/" + ENV.APP.NAMESPACE_V2;
  ENV.APP.LONG_TERM_IMAGE_STORAGE_ID_PREFIX = "azure-";
  ENV.APP.LONG_TERM_IMAGE_STORAGE_BASE_URL =
    "https://goodcityimages.blob.core.windows.net/images-" + environment + "/";
  return ENV;
};
