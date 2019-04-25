import { debounce } from "@ember/runloop";
import $ from "jquery";
import { computed, observer } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";
import { getOwner } from "@ember/application";
import { translationMacro as t } from "ember-i18n";

export default Controller.extend({
  filter: "",
  searchText: "",
  fetchMoreResult: true,
  searchPlaceholder: t("search.placeholder"),
  i18n: service(),

  allUsers: computed("fetchMoreResult", function() {
    var currentUser = this.session.get("currentUser");
    return this.store
      .peekAll("user")
      .rejectBy("id", currentUser.id)
      .rejectBy("permission.name", "System");
  }),

  hasSearchText: computed("searchText", function() {
    return $.trim(this.get("searchText")).length;
  }),

  hasFilter: computed("filter", function() {
    return $.trim(this.get("filter")).length;
  }),

  onSearchTextChange: observer("searchText", function() {
    // wait before applying the filter
    debounce(this, this.applyFilter, 500);
  }),

  applyFilter: function() {
    this.set("filter", this.get("searchText"));
    this.set("fetchMoreResult", true);
  },

  filteredResults: computed(
    "filter",
    "fetchMoreResult",
    "allUsers.[]",
    function() {
      var filter = $.trim(this.get("filter").toLowerCase());
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
        $("#searchText").focus();
      }
    },

    cancelSearch() {
      $("#searchText").blur();
      this.send("clearSearch", true);
      this.transitionToRoute("my_list");
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
