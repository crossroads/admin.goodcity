import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";

export default Controller.extend({
  i18n: service(),
  pageTitle: computed(function() {
    return this.get("i18n").t("inbox.closed_offers");
  })
});
