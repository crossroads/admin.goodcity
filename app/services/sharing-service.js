import Ember from "ember";
import ApiBaseService from "./api-base-service";
import config from "../config/environment";
import { toID } from "../utils/helpers";
import { SHAREABLE_TYPES } from "../models/shareable";

export default ApiBaseService.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  offerService: Ember.inject.service(),

  init() {
    this.useBaseUrl(config.APP.SERVER_PATH_V2);
  },

  /**
   * Loads shareable records
   *
   * @param {string} type
   * @param {string|string[]} ids
   * @returns {Promise<Shareable[]>}
   */
  loadShareable(type, ids) {
    ids = Array.isArray(ids) ? ids : [ids];

    return this.get("store").query("shareable", {
      resource_type: type,
      resource_id: ids.join(",")
    });
  },

  async loadOfferShareables(offer) {
    const offerService = this.get("offerService");

    const [some, more] = await Ember.RSVP.all([
      this.loadShareable(SHAREABLE_TYPES.OFFER, offer.get("id")),
      this.loadShareable(
        SHAREABLE_TYPES.PACKAGE,
        offerService.packagesOf(offer).map(toID)
      )
    ]);

    return [...some.toArray(), ...more.toArray()]; // flatten
  },

  share(type, id, opts = {}) {
    const { allowListing = false } = opts;
    let shareable = this.get("store")
      .peekAll("shareable")
      .filterBy("resourceType", type)
      .findBy("resourceId", id);

    shareable =
      shareable ||
      this.get("store").createRecord("shareable", {
        resourceId: id,
        resourceType: type
      });

    shareable.set("allowListing", allowListing);

    if (Object.keys(shareable.changedAttributes()).length === 0) {
      return Ember.RSVP.resolve(shareable);
    }

    return shareable.save();
  },

  async unshare(type, ids) {
    ids = Array.isArray(ids) ? ids : [ids];

    await this.DELETE("/shareables/unshare", {
      resource_type: type,
      resource_id: ids.join(",")
    });

    this.get("store")
      .peekAll("shareable")
      .filterBy("resourceType", type)
      .forEach(sh => {
        const unload = ids.find(id => id === sh.get("resourceId"));

        if (unload) {
          this.get("store").unloadRecord(sh);
        }
      });
  },

  async unshareOffer(offer) {
    const offerService = this.get("offerService");

    await Ember.RSVP.all([
      this.unshare(SHAREABLE_TYPES.OFFER, offer.get("id")),
      this.unshare(
        SHAREABLE_TYPES.PACKAGE,
        offerService.packagesOf(offer).map(toID)
      )
    ]);
  }
});
