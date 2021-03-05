import Ember from "ember";
import _ from "lodash";

export default Ember.Component.extend({
  messageService: Ember.inject.service(),
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set("isSelected", true);
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
    }
  }
});
