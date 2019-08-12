import Ember from "ember";
<<<<<<< HEAD
import { translationMacro as t } from "ember-i18n";
const { getOwner } = Ember;

export default Ember.Controller.extend({
  filter: "",
  searchText: "",
  fetchMoreResult: true,
=======
import AsyncTasksMixin from "../mixins/async_tasks";
import { translationMacro as t } from "ember-i18n";
const { getOwner } = Ember;

export default Ember.Controller.extend(AsyncTasksMixin, {
  searchText: "",
>>>>>>> paginated messages
  searchPlaceholder: t("search.placeholder"),
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  runningPromisesCount: 0,
  results: [],

  hasSearchText: Ember.computed("searchText", function() {
    return Ember.$.trim(this.get("searchText")).length;
  }),

  onSearchTextChange: Ember.observer("searchText", function() {
    // wait before applying the filter
    Ember.run.debounce(this, this.applyFilter, 500);
  }),

  filteredResults: Ember.computed("results.[]", function() {
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
          .query("user", { searchText })
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
    clearSearch(isCancelled) {
      this.set("searchText", "");
      this.set("filteredResults", []);
    },

    cancelSearch() {
      Ember.$("#searchText").blur();
      this.send("clearSearch");
      this.transitionToRoute("my_list");
    }
  }
});
