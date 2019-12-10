import { debounce, run } from "@ember/runloop";
import $ from "jquery";
import { computed, observer } from "@ember/object";
import Controller from "@ember/controller";
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Controller.extend({
  displayResults: false,
  minSearchTextLength: 3,

  hasSearchText: computed("searchText", function() {
    return $.trim(this.get("searchText")).length;
  }),

  onSearchTextChange: observer("searchText", function() {
    // wait before applying the filter
    debounce(this, this.reloadResults, 500);
  }),

  reloadResults() {
    this.hideResults();
    debounce(this, this.showResults, 500);
  },

  showResults() {
    run(() => {
      this.set("displayResults", true);
    });
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

  trimQuery(query) {
    // Remove any undefined values
    return _.pickBy(query, _.identity);
  },

  hideResults() {
    run(() => {
      this.set("displayResults", false);
    });
  },

  actions: {
    clearSearch() {
      this.set("searchText", "");
    },

    cancelSearch() {
      this.transitionToRoute(
        "review_offer.donor_details",
        this.get("model.id")
      );
    },

    loadMoreCompanies(pageNo) {
      const params = this.trimQuery(
        _.merge({}, this.getSearchQuery(), this.getPaginationQuery(pageNo))
      );
      if (this.get("searchText").length > this.get("minSearchTextLength")) {
        return this.store.query("company", params);
      }
      this.hideResults();
    },

    goToDetails(companyId) {
      let offerId = this.get("model.id");
      let offerParams = {
        company_id: companyId
      };
      new AjaxPromise(
        "/offers/" + offerId,
        "PUT",
        this.get("session.authToken"),
        {
          offer: offerParams
        }
      ).then(data => {
        this.store.pushPayload(data);
        this.transitionToRoute("review_offer.donor_details", offerId);
      });
    }
  }
});
