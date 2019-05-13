// import Ember from 'ember';
import $ from "jquery";

import Application from "../../app";
import Router from "../../router";
import { merge } from "@ember/polyfills";
import { run } from "@ember/runloop";
import config from "../../config/environment";
import "./custom-helpers";

export default function startApp(attrs, permissionId) {
  //place setting of localStorage variables here so app doesn't cache values from previous tests

  //auth
  if (permissionId === 2) {
    window.localStorage.authToken = '"pas89df7asjknf"';
    window.localStorage.currentUserId = '"3"';
  } else if (permissionId === 1) {
    window.localStorage.authToken = '"7sakjhf8s6dasd"';
    window.localStorage.currentUserId = '"2"';
  } else {
    window.localStorage.authToken =
      '"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0MDkwMzgzNjUsImlzcyI6Ikdvb2RDaXR5SEsiLCJleHAiOjE0MTAyNDc5NjUsIm1vYmlsZSI6Iis4NTI2MTA5MjAwMSIsIm90cF9zZWNyZXRfa2V5IjoiemRycGZ4c2VnM3cyeWt2aSJ9.lZQaME1oKw7E5cdfks0jG3A_gxlOZ7VfUVG4IMJbc08"';
    window.localStorage.currentUserId = '"1"';
  }

  let application;

  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  Router.reopen({
    location: "none"
  });

  run(function() {
    application = Application.create(attributes);
    application.__container__.lookup("service:i18n").set("locale", "en");
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });

  //window.navigator = {onLine:true,plugins:[]};
  // window.alert = function(message) {
  //   console.log("Alert: " + message);
  // };
  // window.confirm = function(message) {
  //   console.log("Confirm: " + message);
  //   return true;
  // };
  // $("head").append(
  //   "<style>.loading-indicator, .reveal-modal-bg, .reveal-modal {display:none !important;}</style>"
  // );
  // lookup("service:logger").error = message => QUnit.assert.equal(message, "");

  // //needed by application controller init
  // lookup("controller:subscriptions").actions.wire = function() {};

  return application;
}
