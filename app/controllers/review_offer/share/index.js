import Ember from "ember";
import AsyncTasksMixin from "../../../mixins/async_tasks";
import { SHAREABLE_TYPES } from "../../../models/shareable";

export default Ember.Controller.extend(AsyncTasksMixin, {
  parentController: Ember.inject.controller("review_offer.share"),
  isShared: Ember.computed.alias("parentController.isShared"),
  offerSheareable: Ember.computed.alias("parentController.isShared"),
  shareables: Ember.computed.alias("parentController.shareables"),
  offerService: Ember.inject.service(),
  sharingService: Ember.inject.service(),

  sharingModes: Object.freeze({
    PRIVATE: "private",
    PUBLIC: "public",
    PUBLIC_LISTED: "public_listed"
  }),

  isPackageShared(pkg) {
    return Boolean(
      this.get("store")
        .peekAll("shareable")
        .filterBy("isPackage")
        .findBy("resourceId", pkg.get("id"))
    );
  },

  computeSharingMode(shareable) {
    if (!shareable) {
      return this.sharingModes.PRIVATE;
    }
    return shareable.get("allowListing")
      ? this.sharingModes.PUBLIC_LISTED
      : this.sharingModes.PUBLIC;
  },

  buildPackageList() {
    const offer = this.get("offer");
    const packages = this.get("offerService").packagesOf(offer);

    if (packages.length === 0) {
      this.raiseI18n("review_offer.cannot_share_offer_without_packages");
    }

    return packages.map(p => {
      return {
        package: p,
        shared: this.isPackageShared(p)
      };
    });
  },

  persistOfferShareable({ allowListing }) {
    const sharing = this.get("sharingService");
    return sharing.share(SHAREABLE_TYPES.OFFER, this.get("offer.id"), {
      allowListing
    });
  },

  persistPackageShareables() {
    const sharing = this.get("sharingService");
    return Ember.RSVP.all(
      this.get("packageList").reduce(
        (promises, row) => [
          ...promises,
          row.shared
            ? sharing.share(SHAREABLE_TYPES.PACKAGE, row.package.get("id"))
            : sharing.unshare(SHAREABLE_TYPES.PACKAGE, row.package.get("id"))
        ],
        []
      )
    );
  },

  async unshareAll() {
    await this.get("sharingService").unshareOffer();
  },

  actions: {
    setSharingMode(mode) {
      this.set("selectedSharingMode", mode);
    },

    startEdit() {
      this.modalCatch(() => {
        const shareable = this.get("offerSheareable");
        this.set("selectedSharingMode", this.computeSharingMode(shareable));
        this.set("packageList", this.buildPackageList());
        this.set("showEditor", true);
      });
    },

    cancelEdit() {
      this.get("offerService")
        .packagesOf(this.get("offer"))
        .forEach(p => p.rollbackAttributes());
      this.set("packageList", []);
      this.set("showEditor", false);
    },

    applyChanges() {
      const offer = this.get("offer");
      const shared =
        this.get("selectedSharingMode") !== this.get("sharingModes.PRIVATE");
      const listed =
        this.get("selectedSharingMode") ===
        this.get("sharingModes.PUBLIC_LISTED");

      this.runTask(async () => {
        if (!shared) {
          await this.get("sharingService").unshareOffer(offer);
        } else {
          await Ember.RSVP.all([
            this.persistOfferShareable({ allowListing: listed }),
            this.persistPackageShareables()
          ]);
        }

        this.set("showEditor", false);
      });
    }
  }
});
