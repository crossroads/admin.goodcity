import Ember from "ember";
import _ from "lodash";

export default Ember.Component.extend({
  messageService: Ember.inject.service(),
  displayResults: true,
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set("selected", "canned");
    this.set("isSelected", true);
  },

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

  actions: {
    loadMoreCannedMessages() {
      const params = {
        searchText: this.get("searchText"),
        is_canned: false,
        is_system: false
      };
      return this.get("store").query("canned_response", params);
    },

    addMessage() {
      this.set("messageService.isAddMessageVisible", true);
    },

    closeOverlay() {
      this.set("messageService.isProFormaMessageVisible", false);
    },

    selectTab(selectedTab = "canned") {
      this.set("selected", selectedTab);
      if (selectedTab == "canned") {
        this.set("isSelected", true);
      } else {
        this.set("isSelected", false);
      }
    },

    editMessage(message) {
      this.set("messageService.editMessage", message.id);
      this.send("addMessage");
    },

    cancel() {
      this.set("open", false);
    }
  }
});
