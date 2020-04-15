import ApiBaseService from "./api-base-service";

export default ApiBaseService.extend({
  offersCount() {
    return this.GET(`/offers/summary`);
  },

  offersSearch(searchParams) {
    return this.GET(`/offers/search`, searchParams);
  },

  addNewItem(offer) {
    const defaultDonorCondition = this.get("store")
      .peekAll("donorCondition")
      .sortBy("id")
      .get("firstObject");

    return this.get("store")
      .createRecord("item", {
        offer: offer,
        donorCondition: defaultDonorCondition,
        state: "draft"
      })
      .save();
  }
});
