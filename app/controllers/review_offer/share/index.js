import Ember from "ember";
import AsyncTasksMixin from "../../../mixins/async_tasks";
import { SHAREABLE_TYPES } from "../../../models/shareable";
import config from "../../../config/environment";

export default Ember.Controller.extend(AsyncTasksMixin, {
  parentController: Ember.inject.controller("review_offer.share"),
  isShared: Ember.computed.alias("parentController.isShared"),
  offerShareable: Ember.computed.alias("parentController.offerShareable"),
  shareables: Ember.computed.alias("parentController.shareables"),
  offerService: Ember.inject.service(),
  sharingService: Ember.inject.service(),

  offerLink: Ember.computed("offerShareable.publicUid", function() {
    if (!this.get("isShared")) {
      return "";
    }
    return (
      config.BROWSE_APP_HOST_URL +
      "/offer/" +
      this.get("offerShareable.publicUid")
    );
  }),

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

  allowConfirm: Ember.computed(
    "selectedSharingMode",
    "packageList",
    "packageList.length",
    "packageList.@each.shared",
    function() {
      return (
        this.get("selectedSharingMode") === this.get("sharingModes").PRIVATE ||
        this.getWithDefault("packageList", []).findBy("shared", true)
      );
    }
  ),

  persistPackageChanges() {
    return Ember.RSVP.all(
      this.get("packageList").reduce((promises, row) => {
        if (
          row.package.changedAttributes().notes ||
          row.package.changedAttributes().notesZhTw
        ) {
          promises.push(row.package.save());
        }
        return promises;
      }, [])
    );
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
            this.persistPackageChanges(),
            this.persistOfferShareable({ allowListing: listed }),
            this.persistPackageShareables()
          ]);
        }

        this.set("showEditor", false);
      });
    }
  }
});
