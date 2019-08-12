import Ember from "ember";

export default Ember.Component.extend({
  attributeBindings: [
    "record",
    "recordId",
    "placeholder",
    "content",
    "enabled",
    "id"
  ],
  isAndroidDevice: false,
  enabled: true,
  cordova: Ember.inject.service(),

  didInsertElement() {
    var isAndroidDevice = this.get("cordova").isAndroid();
    this.set("isAndroidDevice", isAndroidDevice);
  }
});
