import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import config from "../../config/environment";

export default Controller.extend({
  donor: null,
  currentOffer: null,
  offersCount: alias("model.length"),
  goodcityNumber: config.APP.GOODCITY_NUMBER,
  internetCallStatus: controller(),

  displayNumber: computed("donor.mobile", function() {
    var num = this.get("donor.mobile").replace(/\+852/, "");
    return num.length > 4 ? num.substr(0, 4) + " " + num.substr(4) : num;
  }),

  donorOffers: computed("model", function() {
    return this.get("model").rejectBy("id", this.get("currentOffer.id"));
  }),

  receivedOffers: computed("model", function() {
    return this.get("model").filterBy("isReceived", true).length;
  })
});
