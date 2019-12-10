import { inject as service } from "@ember/service";
import Component from "@ember/component";

export default Component.extend({
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
  cordova: service(),

  didInsertElement() {
    var isAndroidDevice = this.get("cordova").isAndroid();
    this.set("isAndroidDevice", isAndroidDevice);
  }
});
