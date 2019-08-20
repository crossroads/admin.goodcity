import Ember from "ember";
import _ from "lodash";
import AjaxPromise from "goodcity/utils/ajax-promise";

export default Ember.Controller.extend({
  displayResults: false,
  minSearchTextLength: 3,

  hasSearchText: Ember.computed("searchText", function() {
    return Ember.$.trim(this.get("searchText")).length;
  }),

  onSearchTextChange: Ember.observer("searchText", function() {
    // wait before applying the filter
    Ember.run.debounce(this, this.reloadResults, 500);
  }),

  reloadResults() {
    this.hideResults();
    Ember.run.debounce(this, this.showResults, 500);
  },

  showResults() {
    Ember.run(() => {
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
    Ember.run(() => {
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
