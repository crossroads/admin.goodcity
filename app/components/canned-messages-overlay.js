import Ember from "ember";
import _ from "lodash";

export default Ember.Component.extend({
  messageService: Ember.inject.service(),
  displayResults: true,
  store: Ember.inject.service(),
  onSearchTextChange: Ember.observer("searchText", function() {
    Ember.run.debounce(this, this.reloadResults, 500);
  }),

  reloadResults() {
    this.set("displayResults", false);
    Ember.run.debounce(this, () => this.set("displayResults", true), 500);
  },

  actions: {
    loadMoreCannedMessages() {
      const params = { searchText: this.get("searchText") };
      return this.get("store").query("canned_response", params);
    },

    setCannedResponse(text) {
      const onSelect = this.getWithDefault("onSelect", _.noop);
      onSelect(text);
      this.set("open", false);
    },

    cancel() {
      this.set("open", false);
    }
  }
});
