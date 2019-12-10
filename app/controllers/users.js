import { debounce } from "@ember/runloop";
import $ from "jquery";
import { computed, observer } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";
import AsyncTasksMixin from "../mixins/async_tasks";
import { translationMacro as t } from "ember-i18n";

export default Controller.extend(AsyncTasksMixin, {
  searchText: "",
  searchPlaceholder: t("search.placeholder"),
  store: service(),
  i18n: service(),
  runningPromisesCount: 0,
  results: [],

  hasSearchText: computed("searchText", function() {
    return $.trim(this.get("searchText")).length;
  }),

  onSearchTextChange: observer("searchText", function() {
    // wait before applying the filter
    debounce(this, this.applyFilter, 500);
  }),

  filteredResults: computed("results.[]", function() {
    const currentUser = this.session.get("currentUser");
    return this.get("results")
      .rejectBy("id", currentUser.id)
      .rejectBy("permission.name", "System");
  }),

  applyFilter: function() {
    if (this.get("hasSearchText")) {
      let searchText = this.get("searchText");
      this.runTask(
        this.get("store")
          .query("user", {
            searchText
          })
          .then(users => {
            // Check the input has changed since the promise started
            if (searchText === this.get("searchText")) {
              this.set("results", users);
            }
          })
      );
    }
  },

  actions: {
    clearSearch() {
      this.set("searchText", "");
      this.set("results", []);
    },

    cancelSearch() {
      $("#searchText").blur();
      this.send("clearSearch");
      this.transitionToRoute("dashboard");
    }
  }
});
