import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
import backNavigator from "./../mixins/back_navigator";
import AjaxPromise from "goodcity/utils/ajax-promise";
import utilityMethods from "../utils/utility-methods";
import _ from "lodash";

const { getOwner } = Ember;

export default Ember.Controller.extend(backNavigator, {
  filter: "",
  searchText: "",
  searchPlaceholder: t("search.placeholder"),
  i18n: Ember.inject.service(),
  filterService: Ember.inject.service(),

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

  getSearchQuery() {
    return {
      searchText: this.get("filter")
    };
  },

  getFilterQuery() {
    const filterService = this.get("filterService");
    const isPriority = filterService.isPriority();
    const { after, before } = filterService.get("offerTimeRange");
    let stateFilters = _.without(
      filterService.get("offerStateFilters"),
      "showPriority"
    );

    return {
      state: utilityMethods.stringifyArray(stateFilters),
      priority: isPriority,
      after: after && after.getTime(),
      before: before && before.getTime()
    };
  },

  getSearchQuery() {
    return {
      searchText: this.get("searchText")
    };
  },

  getPaginationQuery(pageNo) {
    return {
      per_page: 25,
      page: pageNo
    };
  },

  getReviewerFilter() {
    return {
      selfReview: this.get("filterService.selfReviewFilter")
    };
  },

  trimQuery(query) {
    // Remove any undefined values
    return _.pickBy(query, _.identity);
  },

  searchOnServer() {
    let search = this.get("filter");
    if (!search) {
      this.set("filteredResults", null);
      return;
    }
    const params = this.trimQuery(
      _.merge(
        { slug: "search" },
        this.getFilterQuery(),
        this.getReviewerFilter(),
        this.getSearchQuery(),
        this.getPaginationQuery(1)
      )
    );
    let loadingView = getOwner(this)
      .lookup("component:loading")
      .append();
    let store = this.get("store");

    store
      .query("offer", params)
      .then(data => {
        store.pushPayload(data);
        this.set("filteredResults", data);
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
