import Ember from "ember";
import _ from "lodash";

const SYSTEM = "SYSTEM";

export default Ember.Component.extend({
  messageService: Ember.inject.service(),
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set("isSelected", true);
    this.set("selected", "canned");
  },

  onSearchTextChange: Ember.observer("searchText", function() {
    Ember.run.debounce(this, this.reloadResults, 500);
  }),

  refreshDisplayResult: Ember.observer(
    "messageService.isAddMessageVisible",
    function() {
      if (!this.get("messageService.isAddMessageVisible")) {
        this.reloadResults();
      }
    }
  ),

  didRender() {
    if (this.get("messageService.isProFormaMessageVisible")) {
      this.set("displayResults", true);
    }
  },

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
        searchText: this.get("searchText")
      };
      if (this.get("selected") == "system") {
        params.message_type = SYSTEM;
      }
      return this.get("store").query("canned_response", params);
    },

    addMessage() {
      this.set("messageService.isAddMessageVisible", true);
    },

    closeOverlay() {
      this.set("messageService.isProFormaMessageVisible", false);
    },

    editMessage(message, lang) {
      this.set("messageService.editMessage.messageId", message.id);
      this.set("messageService.editMessage.language", lang);
      this.send("addMessage");
    },

    cancel() {
      this.set("open", false);
    },

    selectTab(selectedTab = "canned") {
      this.set("selected", selectedTab);
      if (selectedTab == "canned") {
        this.set("isSelected", true);
      } else {
        this.set("isSelected", false);
      }
    }
  }
});
