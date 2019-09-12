import ApiBaseService from "./api-base-service";

export default ApiBaseService.extend({
  offersCount() {
    return this.GET(`/offers/summary`);
  },

  offersSearch(searchParams) {
    return this.GET(`/offers/search`, searchParams);
  }
});
