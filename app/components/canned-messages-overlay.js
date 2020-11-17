import Ember from "ember";
import _ from "lodash";
import AsyncTasksMixin, { ERROR_STRATEGIES } from "../mixins/async_tasks";

export default Ember.Component.extend(AsyncTasksMixin, {
  messageService: Ember.inject.service(),
  store: Ember.inject.service(),

  async init() {
    this._super();
    await this.runTask(async () => {
      await this.get("messageService").fetchCannedResponse();
      this.set("cannedResponses", this.get("store").peekAll("canned_response"));
    }, ERROR_STRATEGIES.MODAL);
  },

  didRender() {
    console.log(this.get("open"));
  },

  actions: {
    setCannedResponse(text) {
      const onSelect = this.getWithDefault("onSelect", _.noop);
      onSelect(text);
      this.set("open", false);
    }
  }
});
