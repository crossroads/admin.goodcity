import ApiBaseService from "./api-base-service";
import { toID } from "goodcity/utils/helpers";

export default ApiBaseService.extend({
  fetchOffer(id, params) {
    return this.GET(`/offers/${id}`, params).then(payload => {
      this.get("store").pushPayload(payload);
      return this.get("store").peekRecord("offer", id);
    });
  },

  offersCount() {
    return this.GET(`/offers/summary`);
  },

  offersSearch(searchParams) {
    return this.GET(`/offers/search`, searchParams);
  },

  async mergeableOffers(offerID) {
    const data = await this.GET(`/offers/${offerID}/mergeable_offers`);
    this.get("store").pushPayload(data);

    return (data.offers || []).map(({ id }) => {
      return this.get("store").peekRecord("offer", id);
    });
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
  },

  reopenOffer(offer) {
    return this.__udpateState(offer, "reopen_offer");
  },

  resumeReceiving(offer) {
    return this.__udpateState(offer, "resume_receiving");
  },

  async __udpateState(offer, state, params = {}) {
    const id = toID(offer);
    const url = `/offers/${id}/${state}`;

    const data = await this.PUT(url, params);
    this.get("store").pushPayload(data);
    return this.get("store").peekRecord("offer", id);
  },

  packagesOf(offer) {
    return offer.get("items").reduce((pkgs, item) => {
      return [...pkgs, ...item.get("packages").toArray()];
    }, []);
  }
});
