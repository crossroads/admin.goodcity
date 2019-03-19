import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
import backNavigator from "./../mixins/back_navigator";
import AjaxPromise from "goodcity/utils/ajax-promise";
const { getOwner } = Ember;

export default Ember.Controller.extend(backNavigator, {
  filter: "",
  searchText: "",
  searchPlaceholder: t("search.placeholder"),
  i18n: Ember.inject.service(),

  allUsers: Ember.computed(function() {
    return this.store.peekAll("user");
  }),

  allItems: Ember.computed(function() {
    return this.store.peekAll("item");
  }),

  allGogovanOrders: Ember.computed(function() {
    return this.store.peekAll("gogovan_order");
  }),

  allPackageTypes: Ember.computed(function() {
    return this.store.peekAll("package_type");
  }),

  allAddresses: Ember.computed(function() {
    return this.store.peekAll("address");
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
        Ember.$("#searchText").focus();
      }
    },

    cancelSearch() {
      Ember.$("#searchText").blur();
      this.send("clearSearch", true);
      this.send("togglePath", "search");
    }
  }
});
