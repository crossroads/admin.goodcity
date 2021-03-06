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

  hasSearchText: Ember.computed("searchText", function() {
    return this.get("searchText") && this.get("searchText").trim().length;
  }),

  refreshDisplayResult: Ember.observer(
    "messageService.isAddMessageVisible",
    function() {
      if (!this.get("messageService.isAddMessageVisible")) {
        this.reloadResults();
      }
    }
  ),

  actions: {
    loadMoreCannedMessages() {
      const params = { searchText: this.get("searchText") };
      return this.get("store").query("canned_response", params);
    },

    openProFormaOverlay() {
      this.set("messageService.isProFormaMessageVisible", true);
    },

    setCannedResponse(text) {
      if (!text) return;
      const onSelect = this.getWithDefault("onSelect", _.noop);
      onSelect(text);
      this.set("open", false);
    },

    clearSearch() {
      this.set("searchText", "");
    },

    cancel() {
      this.set("open", false);
    }
  }
});
