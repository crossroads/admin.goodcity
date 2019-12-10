import { debounce, run } from "@ember/runloop";
import $ from "jquery";
import { computed, observer } from "@ember/object";
import { inject as service } from "@ember/service";
import Controller from "@ember/controller";
import { translationMacro as t } from "ember-i18n";
import backNavigator from "./../mixins/back_navigator";
import utilityMethods from "../utils/utility-methods";
import _ from "lodash";

export default Controller.extend(backNavigator, {
  filter: "",
  searchText: "",
  searchPlaceholder: t("search.placeholder"),
  minSearchTextLength: 1,
  i18n: service(),
  displayResults: false,
  filterService: service(),

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

  onSearchTextChange: observer("searchText", function() {
    const searchTextLength = this.get("searchText").length;
    if (
      searchTextLength > this.get("minSearchTextLength") ||
      searchTextLength === 0
    ) {
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
    debounce(this, this.showResults, 500);
  },

  hideResults() {
    run(() => {
      this.set("displayResults", false);
    });
  },

  showResults() {
    run(() => {
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
          { slug: "search" }, //slug: is an identifier used in offer adapter to query url `/offers/search`
          this.getFilterQuery(),
          this.getReviewerFilter(),
          this.getSearchQuery(),
          this.getPaginationQuery(pageNo)
        )
      );
      return this.get("store").query("offer", params);
    },

    clearSearch() {
      this.set("searchText", "");
    },

    cancelSearch() {
      this.transitionToRoute("dashboard");
    }
  }
});
