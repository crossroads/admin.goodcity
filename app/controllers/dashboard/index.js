import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";

export default Controller.extend({
  i18n: service(),
  filterService: service(),
  priority: true,
  selfReview: false,

  offersCount: alias("model.offersCount"),
  pageTitle: computed(function() {
    return this.get("i18n").t("dashboard.title");
  })
});
