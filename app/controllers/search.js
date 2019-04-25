import { debounce } from "@ember/runloop";
import $ from "jquery";
import { computed, observer } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";
import { getOwner } from "@ember/application";
import { translationMacro as t } from "ember-i18n";
import backNavigator from "./../mixins/back_navigator";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Controller.extend(backNavigator, {
  filter: "",
  searchText: "",
  searchPlaceholder: t("search.placeholder"),
  i18n: service(),

  allUsers: computed(function() {
    return this.store.peekAll("user");
  }),

  allItems: computed(function() {
    return this.store.peekAll("item");
  }),

  allGogovanOrders: computed(function() {
    return this.store.peekAll("gogovan_order");
  }),

  allPackageTypes: computed(function() {
    return this.store.peekAll("package_type");
  }),

  allAddresses: computed(function() {
    return this.store.peekAll("address");
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
    this.searchOnServer();
  },

  searchOnServer() {
    let search = this.get("filter");
    if (!search) {
      this.set("filteredResults", null);
      return;
    }

    let loadingView = getOwner(this)
      .lookup("component:loading")
      .append();
    let url = `/offers/search?searchText=${search}`;
    let store = this.get("store");

    new AjaxPromise(url, "GET", this.get("session.authToken"))
      .then(data => {
        store.pushPayload(data);
        const results = data.offers
          .map(o => store.peekRecord("offer", o.id))
          .filter(Boolean);
        this.set("filteredResults", results);
      })
      .finally(() => {
        loadingView.destroy();
      });
  },

  actions: {
    clearSearch(isCancelled) {
      this.set("filter", "");
      this.set("searchText", "");
      if (!isCancelled) {
        $("#searchText").focus();
      }
    },

    cancelSearch() {
      $("#searchText").blur();
      this.send("clearSearch", true);
      this.send("togglePath", "search");
    }
  }
});
