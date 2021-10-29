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
      "img-src": "'self' data: https://res.cloudinary.com filesystem: *",
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
      CROSSROADS_CONTACT: "2272 9345",
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
      emulate: false,
      FcmSenderId: "907786683525"
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
    ENV.APP.GOODCITY_NUMBER = "+85258087803";

    ENV.contentSecurityPolicy["connect-src"] = [
      "http://localhost:4201",
      "http://localhost:3000",
      "http://localhost:1337",
      "ws://localhost:1337",
      "wss://localhost:1337",
      "https://api.cloudinary.com",
      "https://api.twilio.com",
      "http://static.twilio.com",
      "https://static.twilio.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com/v1/EndpointEvents"
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
      throw "Please pass an appropriate ENVIRONMENT=(staging|preview|production) param.";
    // RESTAdapter Settings
    ENV.APP.API_HOST_URL = "https://api.goodcity.hk";
    ENV.ADMIN_APP_HOST_URL = "https://admin.goodcity.hk";
    ENV.BROWSE_APP_HOST_URL = "https://charities.goodcity.hk";
    ENV.APP.SOCKETIO_WEBSERVICE_URL = "https://socket.goodcity.hk:81/goodcity";
    ENV.APP.STOCK_APP_HOST_URL = "https://stock.goodcity.hk";
    ENV.APP.STOCK_ANDROID_APP_HOST_URL = "stock.goodcity.hk";
    ENV.APP.GOODCITY_NUMBER = "+85258088700";

    ENV.contentSecurityPolicy["connect-src"] = [
      "https://admin.goodcity.hk",
      "https://api.goodcity.hk",
      "https://socket.goodcity.hk:81",
      "ws://socket.goodcity.hk:81",
      "wss://socket.goodcity.hk:81",
      "https://api.cloudinary.com",
      "https://errbit.crossroads.org.hk",
      "https://media.twiliocdn.com",
      "https://api.twilio.com",
      "http://static.twilio.com",
      "https://static.twilio.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com/v1/EndpointEvents"
    ].join(" ");
    //google analytics
    ENV.googleAnalytics = { webPropertyId: "UA-62978462-2" };
    ENV.cordova.FcmSenderId = "876198075877";
  }

  if (environment === "staging") {
    ENV.APP.API_HOST_URL = "https://api-staging.goodcity.hk";
    ENV.ADMIN_APP_HOST_URL = "https://admin-staging.goodcity.hk";
    ENV.BROWSE_APP_HOST_URL = "https://charities-staging.goodcity.hk";
    ENV.APP.STOCK_APP_HOST_URL = "https://stock-staging.goodcity.hk";
    ENV.APP.STOCK_ANDROID_APP_HOST_URL = "stock-staging.goodcity.hk";
    ENV.APP.SOCKETIO_WEBSERVICE_URL =
      "https://socket-staging.goodcity.hk/goodcity";
    ENV.APP.GOODCITY_NUMBER = "+85258084822";
    ENV.contentSecurityPolicy["connect-src"] = [
      "https://admin-staging.goodcity.hk",
      "https://api-staging.goodcity.hk",
      "https://socket-staging.goodcity.hk",
      "ws://socket-staging.goodcity.hk",
      "wss://socket-staging.goodcity.hk",
      "https://api.cloudinary.com",
      "https://errbit.crossroads.org.hk",
      "https://media.twiliocdn.com",
      "https://api.twilio.com",
      "http://static.twilio.com",
      "https://static.twilio.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com/v1/EndpointEvents"
    ].join(" ");
    ENV.googleAnalytics = { webPropertyId: "UA-62978462-3" };
    ENV.cordova.FcmSenderId = "907786683525";

    // VSO build
    if (process.env.BUILD_BUILDNUMBER) {
      ENV.APP.VERSION =
        process.env.VERSION + "." + process.env.BUILD_BUILDNUMBER;
      ENV.APP.APP_SHA = process.env.BUILD_SOURCEVERSION;
    }
  }
  if (environment === "preview") {
    ENV.APP.API_HOST_URL = "https://api-preview.goodcity.hk";
    ENV.ADMIN_APP_HOST_URL = "https://admin-preview.goodcity.hk";
    ENV.BROWSE_APP_HOST_URL = "https://charities-preview.goodcity.hk";
    ENV.APP.SOCKETIO_WEBSERVICE_URL =
      "https://socket-preview.goodcity.hk/goodcity";
    ENV.APP.STOCK_APP_HOST_URL = "https://stock-staging.goodcity.hk";
    ENV.APP.STOCK_ANDROID_APP_HOST_URL = "stock-staging.goodcity.hk";
    ENV.APP.GOODCITY_NUMBER = "+85258084822";
    ENV.contentSecurityPolicy["connect-src"] = [
      "https://admin-preview.goodcity.hk",
      "https://api-preview.goodcity.hk",
      "https://socket-preview.goodcity.hk",
      "ws://socket-preview.goodcity.hk",
      "wss://socket-preview.goodcity.hk",
      "https://api.cloudinary.com",
      "https://errbit.crossroads.org.hk",
      "https://media.twiliocdn.com",
      "https://api.twilio.com",
      "http://static.twilio.com",
      "https://static.twilio.com",
      "wss://chunderw.twilio.com/signal",
      "wss://chunderw-vpc-gll.twilio.com/signal",
      "https://eventgw.twilio.com/v1/EndpointEvents"
    ].join(" ");
    ENV.googleAnalytics = { webPropertyId: "UA-62978462-3" };
    ENV.cordova.FcmSenderId = "907786683525";

    // VSO build
    if (process.env.BUILD_BUILDNUMBER) {
      ENV.APP.VERSION =
        process.env.VERSION + "." + process.env.BUILD_BUILDNUMBER;
      ENV.APP.APP_SHA = process.env.BUILD_SOURCEVERSION;
    }
  }

  ENV.APP.SERVER_PATH = ENV.APP.API_HOST_URL + "/" + ENV.APP.NAMESPACE;
  ENV.APP.SERVER_PATH_V2 = ENV.APP.API_HOST_URL + "/" + ENV.APP.NAMESPACE_V2;
  return ENV;
};
