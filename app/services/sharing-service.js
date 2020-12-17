import Ember from "ember";
import ApiBaseService from "./api-base-service";
import config from "../config/environment";

export const SHAREABLE_TYPES = {
  OFFER: "Offer"
};

export default ApiBaseService.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  init() {
    this.useBaseUrl(config.APP.SERVER_PATH_V2);
  },

  async findShareable(type, id) {
    const list = await this.get("store").query("shareable", {
      resource_type: type,
      resource_id: id
    });

    return list.get("firstObject");
  }
});
