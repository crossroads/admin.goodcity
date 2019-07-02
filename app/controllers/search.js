import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
import backNavigator from "./../mixins/back_navigator";
import utilityMethods from "../utils/utility-methods";
import _ from "lodash";

export default Ember.Controller.extend(backNavigator, {
  filter: "",
  searchText: "",
  searchPlaceholder: t("search.placeholder"),
  minSearchTextLength: 1,
  i18n: Ember.inject.service(),
  displayResults: false,
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
    if (this.get("searchText").length > this.get("minSearchTextLength")) {
      this.reloadResults();
    }
  }),

  on() {
    this.showResults(); // Upon opening the page, we populate with results
    this.get("filterService").on("change", this, this.reloadResults);
  },

  off() {
    this.get("filterService").off("change", this, this.reloadResults);
  },

  reloadResults() {
    this.hideResults();
    Ember.run.debounce(this, this.showResults, 500);
  },

  hideResults() {
    Ember.run(() => {
      this.set("displayResults", false);
    });
  },

  showResults() {
    Ember.run(() => {
      this.set("displayResults", true);
    });
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

  actions: {
    loadMoreOffers(pageNo) {
      const params = this.trimQuery(
        _.merge(
          { slug: "search" },
          this.getFilterQuery(),
          this.getReviewerFilter(),
          this.getSearchQuery(),
          this.getPaginationQuery(pageNo)
        )
      );
      return this.get("store").query("offer", params);
    },

    clearSearch(isCancelled) {
      this.set("filter", "");
      this.set("searchText", "");
      if (!isCancelled) {
        Ember.$("#searchText").focus();
      }
    },

    cancelSearch() {
      this.transitionToRoute("my_list.reviewing");
    }
  }
});
