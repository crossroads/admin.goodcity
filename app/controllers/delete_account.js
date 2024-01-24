import Ember from "ember";
import AsyncTasksMixin, { ERROR_STRATEGIES } from "../mixins/async_tasks";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Ember.Controller.extend(AsyncTasksMixin, {
  user: Ember.computed.alias("model.user"),
  application: Ember.inject.controller(),

  actions: {
    cancelAccountDeletion() {
      this.transitionToRoute("my_account");
    },

    confirmDeleteAccount() {
      this.runTask(async () => {
        const userId = this.get("user.id");
        const data = await new AjaxPromise(
          `/users/${userId}`,
          "DELETE",
          this.get("session.authToken")
        );
        this.get("application").send("logMeOut");
      }, ERROR_STRATEGIES.MODAL);
    }
  }
});
