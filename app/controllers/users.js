import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
const { getOwner } = Ember;

export default Ember.Controller.extend({
  filter: "",
  searchText: "",
  fetchMoreResult: true,
  searchPlaceholder: t("search.placeholder"),
  i18n: Ember.inject.service(),

  allUsers: Ember.computed("fetchMoreResult", function() {
    var currentUser = this.session.get("currentUser");
    return this.store
      .peekAll("user")
      .rejectBy("id", currentUser.id)
      .rejectBy("permission.name", "System");
  }),

  hasSearchText: Ember.computed("searchText", function() {
    return Ember.$.trim(this.get("searchText")).length;
  }),

  hasFilter: Ember.computed("filter", function() {
    return Ember.$.trim(this.get("filter")).length;
  }),

  onSearchTextChange: Ember.observer("searchText", function() {
    // wait before applying the filter
    Ember.run.debounce(this, this.applyFilter, 500);
  }),

  applyFilter: function() {
    this.set("filter", this.get("searchText"));
    this.set("fetchMoreResult", true);
  },

  filteredResults: Ember.computed(
    "filter",
    "fetchMoreResult",
    "allUsers.[]",
    function() {
      var filter = Ember.$.trim(this.get("filter").toLowerCase());
      var users = [];
      var matchFilter = value =>
        (value || "").toLowerCase().indexOf(filter) !== -1;

      if (filter.length > 0) {
        this.get("allUsers").forEach(function(user) {
          if (
            matchFilter(user.get("fullName")) ||
            matchFilter(user.get("mobile"))
          ) {
            users.push(user);
          }
        });
      } else {
        users = users.concat(this.get("allUsers").toArray());
      }

      return users.sortBy("firstName", "lastName").uniq();
    }
  ),

  actions: {
    clearSearch(isCancelled) {
      this.set("filter", "");
      this.set("searchText", "");
      this.set("fetchMoreResult", true);
      if (!isCancelled) {
        Ember.$("#searchText").focus();
      }
    },

    cancelSearch() {
      Ember.$("#searchText").blur();
      this.send("clearSearch", true);
      this.transitionToRoute("dashboard");
    },

    searchOnServer() {
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      this.store.findAll("user", { reload: true }).then(() => {
        this.set("fetchMoreResult", false);
        loadingView.destroy();
      });
    }
  }
});
