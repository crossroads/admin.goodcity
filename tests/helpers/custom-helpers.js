import { run, scheduleOnce } from "@ember/runloop";
import { registerAsyncHelper, registerHelper } from "@ember/test";
import FactoryGuy from "ember-data-factory-guy";
import "../factories/user";

export default function() {
  registerAsyncHelper("loginUser", function(app, url) {
    var hk_user;
    hk_user = FactoryGuy.build("with_hk_mobile");
    var authToken = window.localStorage.authToken;
    visit(url);
    fillIn("input#mobile", hk_user.mobile);
    click($("#getsmscode")[0]);
    andThen(function() {
      equal(currentURL(), "/authenticate");
      fillIn("input#pin", "123456");
      click($("#submit_pin")[0]);
      window.localStorage.authToken = authToken;
    });
  });

  registerAsyncHelper("logoutUser", function(app, url) {
    visit(url);
    andThen(function() {
      var ele_logout = $("a:contains('Logout')");
      if (ele_logout.length > 0) {
        click(ele_logout[0]);
      }
    });
  });

  registerHelper("lookup", function(app, name) {
    return app.__container__.lookup(name);
  });

  registerHelper("runloopFix", function(app, callbackFunction) {
    var callback = function() {
      run(callbackFunction);
    };
    scheduleOnce("afterRender", this, callback);
  });
} // jshint ignore:line
