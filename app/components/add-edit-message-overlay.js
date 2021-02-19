import Ember from "ember";
import _ from "lodash";
import AsyncTasksMixin, { ERROR_STRATEGIES } from "../mixins/async_tasks";

export default Ember.Component.extend(AsyncTasksMixin, {
  messageService: Ember.inject.service(),
  store: Ember.inject.service(),

  async didReceiveAttrs() {
    const editMessageId = this.get("messageService.editMessage");
    const store = this.get("store");
    let message;
    if (editMessageId) {
      message = store.peekRecord("canned_response", editMessageId);
    } else {
      message = store.createRecord("canned-response");
    }
    this.set("message", message);
  },

  actions: {
    createCannedMessage() {
      this.runTask(
        this.get("message")
          .save()
          .then(() => this.set("messageService.isAddMessageVisible", false))
      );
    },

    closeOverlay() {
      this.set("messageService.isAddMessageVisible", false);
      this.set("messageService.editMessage", "");
    },

    deleteMessage() {
      const store = this.get("store");
      const message = store.peekRecord(
        "canned_response",
        this.get("message").id
      );
      this.runTask(
        message.destroyRecord().then(() => {
          store.unloadRecord(message);
          this.set("messageService.isAddMessageVisible", false);
        }),
        ERROR_STRATEGIES
      );
    }
  }
});
