import Ember from "ember";
import _ from "lodash";

import ApiBaseService from "./api-base-service";

export default ApiBaseService.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set("isCannedMessagesVisible", false);
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
  }
});
