import Ember from "ember";
import _ from "lodash";

import ApiBaseService from "./api-base-service";

export default ApiBaseService.extend({
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  editMessage: {
    language: "en",
    messageId: ""
  },

  init() {
    this._super(...arguments);
    this.set("isCannedMessagesVisible", false);
    this.set("isProFormaMessageVisible", false);
    this.set("isAddMessageVisible", false);
  },

  toggle() {
    this.toggleProperty("isCannedMessagesVisible");
  },

  async fetchCannedResponse(opts = {}) {
    const data = await this.GET(`/canned_responses`, opts);
    this.get("store").pushPayload(data);
    return data;
  },

  cannedMessageLookup() {
    const deferred = Ember.RSVP.defer();

    Ember.run(() => {
      this.set("isCannedMessagesVisible", true);
      this.set("onCannedMessageSelect", text => {
        this.set("onCannedMessageSelect", _.noop);
        this.set("openLocationSearch", false);
        deferred.resolve(text || null);
      });
    });

    return deferred.promise;
  },

  async getSystemMessage({ guid }) {
    // check if record is already present in store
    const cannedResponses = this.get("store").peekAll("canned_response");
    let record = cannedResponses
      .filter(res => res.get("guid") === guid)
      .get("firstObject.content");

    if (!record) {
      record = await this.GET(`/canned_responses/${guid}`, {
        language: this.get("i18n").get("locale")
      });
      record = record.canned_response.content;
    }

    return record;
  }
});
