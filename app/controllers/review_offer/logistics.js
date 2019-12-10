import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { filterBy } from "@ember/object/computed";
import transportDetails from "./../offer/transport_details";
import config from "./../../config/environment";

export default transportDetails.extend({
  accepted: filterBy("model.items", "state", "accepted"),
  pendingItem: filterBy("model.items", "state", "submitted"),
  i18n: service(),

  crossroadsContact: computed(function() {
    return config.APP.CROSSROADS_CONTACT;
  }),

  ggvDriverUrl: computed("model", "model.delivery.gogovanOrder", function() {
    var language = this.get("session.language");
    var uuid = this.get("model.delivery.gogovanOrder.ggvUuid");
    var url = config.ADMIN_APP_HOST_URL + "/ggv_orders/" + uuid;
    var params = [];
    if (language) {
      params.push("ln=" + language);
    }
    if (params.length) {
      url = url + "?" + params.join("&");
    }
    return url;
  })
});
