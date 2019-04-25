import { run } from "@ember/runloop";
import { test, moduleForComponent } from "ember-qunit";
import startApp from "../../helpers/start-app";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import hbs from "htmlbars-inline-precompile";
import $ from "jquery";

var App;

moduleForComponent(
  "radio-text-input",
  "Integration | Component | radio text input",
  {
    integration: true,
    beforeEach: function() {
      App = startApp({}, 2);
      TestHelper.setup();
      this.render(hbs`{{radio-text-input id=1}}`);
    },
    afterEach: function() {
      run(function() {
        TestHelper.teardown();
      });
      run(App, "destroy");
    }
  }
);

test("is an input tag", function(assert) {
  assert.expect(1);
  assert.equal($("#1").prop("tagName"), "INPUT");
});

test("is of text type", function(assert) {
  assert.expect(1);
  assert.equal($("#1")[0].type, "text");
});

test("is not disabled", function(assert) {
  assert.expect(1);
  assert.equal($("#1")[0].disabled, false);
});
