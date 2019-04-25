import { run } from "@ember/runloop";
import { test, moduleForComponent } from "ember-qunit";
import startApp from "../../helpers/start-app";
import FactoryGuy from "ember-data-factory-guy";
import TestHelper from "ember-data-factory-guy/factory-guy-test-helper";
import hbs from "htmlbars-inline-precompile";

var App, locations, location1;

moduleForComponent(
  "custom-select2",
  "Integration | Component | custom select2",
  {
    integration: true,
    beforeEach: function() {
      App = startApp({}, 2);
      TestHelper.setup();
      location1 = FactoryGuy.make("location");
      locations = [location1];
      this.render(
        hbs`{{custom-select2 content=locations record=location1 recordId=location1.id}}`
      );
    },
    afterEach: function() {
      run(function() {
        TestHelper.teardown();
      });
      run(App, "destroy");
    }
  }
);

test("check didInsert", function(assert) {
  assert.equal(Boolean(this.get("isAndroidDevice")), false);
});
