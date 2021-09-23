import Ember from "ember";
import AsyncTasksMixin from "goodcity/mixins/async_tasks";
import { SHAREABLE_TYPES } from "goodcity/models/shareable";
import config from "goodcity/config/environment";

export default Ember.Controller.extend(AsyncTasksMixin, {
  parent: Ember.inject.controller("review_offer.share"),
  offer: Ember.computed.alias("parent.offer"),
  offerShareable: Ember.computed.alias("parent.offerShareable"),
  shareables: Ember.computed.alias("parent.shareables"),
  offerService: Ember.inject.service(),
  sharingService: Ember.inject.service(),
  charitiesWebsiteURL: config.BROWSE_APP_HOST_URL,

  allMessages: Ember.computed(function() {
    return this.get("store").peekAll("message");
  }),

  messageThreads: Ember.computed(
    "offer.id",
    "offer.createdById",
    "allMessages.[]",
    "allMessages.length",
    "allMessages.@each.{senderId,recipientId}",
    function() {
      let offerResponse = this.get("store")
        .peekAll("offerResponse")
        .filterBy("offerId", this.get("offer.id"));

      return offerResponse.uniq().map(uid => {
        let messages = this.get("allMessages")
          .sortBy("createdAt")
          .filter(
            m =>
              m.get("messageableType") === "OfferResponse" &&
              m.get("messageableId") === uid.id
          );

        const lastMessage = messages.get("lastObject");

        return {
          userId: uid.get("userId"),
          user: this.get("store").peekRecord("user", uid.get("userId")),
          lastMessage: lastMessage,
          unreadCount: messages.reduce((sum, m) => {
            return sum + (m.get("isRead") ? 0 : 1);
          }, 0),
          organisation: this.organisationOf(uid.get("userId"))
        };
      });
    }
  ),

  stopSharingAt: Ember.computed("offerShareable.expiresAt", {
    get() {
      return this.get("offerShareable.expiresAt");
    },
    set(_, value) {
      return value;
    }
  }),

  isOfferShareableLinkAvailable: Ember.computed(
    "offerShareable",
    "stopSharingAt",
    "offer.id",
    function() {
      return this.get("store")
        .peekAll("shareable")
        .filterBy("offerId", this.get("offer.id"))
        .shift();
    }
  ),

  isShared: Ember.computed("isOfferShareableLinkAvailable", function() {
    return this.get("store")
      .peekAll("shareable")
      .filter(sh => {
        return sh.get("resourceId") == this.get("offer.id") && sh.get("active");
      });
  }),

  allowListingEnabled: Ember.computed({
    get() {
      return this.get("offerShareable.allowListing");
    },
    set(_, value) {
      return value;
    }
  }),

  hasSelectedPackages: Ember.computed(
    "packageList",
    "packageList.length",
    "packageList.@each.shared",
    function() {
      return this.getWithDefault("packageList", []).findBy("shared", true);
    }
  ),

  allowSharing: Ember.computed(
    "packageList",
    "packageList.length",
    "packageList.@each.shared",
    "packageList.@each.package.notes.length",
    "stopSharingAt",
    function() {
      let packageList = this.getWithDefault("packageList", []);
      return (
        packageList.findBy("shared", true) &&
        packageList.filterBy("shared", true).rejectBy("package.notes")
          .length === 0 &&
        this.get("stopSharingAt")
      );
    }
  ),

  organisationOf(userId) {
    const ou = this.get("store")
      .peekAll("organisations_user")
      .findBy("userId", userId);

    return ou && ou.get("organisation");
  },

  isPackageShared(pkg) {
    return Boolean(
      this.get("store")
        .peekAll("shareable")
        .filterBy("isPackage")
        .findBy("resourceId", pkg.get("id"))
    );
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

  defaultNotes(locale) {
    const currentLocale = this.get("i18n.locale");
    const saleable = this.get("offer.saleable");

    this.set("i18n.locale", locale);

    const t = k => this.get("i18n").t(k);
    const district = this.getWithDefault(
      "offer.createdBy.address.district.name",
      "Hong Kong"
    );
    const lines = [
      `${t("review_offer.donor.district")}: ${district}`,
      saleable
        ? t("review_offer.sale_allowed")
        : t("review_offer.sale_not_allowed"),
      t("review_offer.sharing_notes_default")
    ];

    this.set("i18n.locale", currentLocale);

    return lines.join("\n");
  },

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
      allowListing: allowListing,
      notes: this.get("notesEn"),
      notesZhTw: this.get("notesZh"),
      expiresAt: this.get("stopSharingAt")
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
    goToStockUserPage(userId) {
      let finalUrl;

      if (this.get("isMobileApp") && cordova.platformId === "android") {
        // jshint ignore:line
        finalUrl =
          "android-app://hk.goodcity.stockstaging/https/" +
          config.APP.STOCK_ANDROID_APP_HOST_URL +
          "/users/" +
          userId;
        window.open(finalUrl, "_system");
      } else {
        finalUrl = config.APP.STOCK_APP_HOST_URL + "/users/" + userId;
        window.open(finalUrl, "_blank");
      }
    },

    openChat(recipientId) {
      this.replaceRoute("review_offer.share.chat", recipientId);
    },

    startEdit() {
      this.modalCatch(() => {
        const shareable = this.get("offerShareable");
        this.set("showZhNotes", false);
        this.set(
          "notesEn",
          shareable ? shareable.get("notes") : this.defaultNotes("en")
        );
        this.set(
          "notesZh",
          shareable ? shareable.get("notesZhTw") : this.defaultNotes("zh-tw")
        );
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
      const listed = this.get("allowListingEnabled");

      this.runTask(async () => {
        await Ember.RSVP.all([
          this.persistPackageChanges(),
          this.persistOfferShareable({ allowListing: listed }),
          this.persistPackageShareables()
        ]);

        this.set("showEditor", false);
      });
    },

    deleteSharing() {
      this.runTask(async () => {
        await this.get("sharingService").unshareOffer(this.get("offer"));
      });
      this.set("showEditor", false);
    },

    toggleSelectAllPackages() {
      const pkgs = this.get("packageList");
      const on = Boolean(pkgs.findBy("shared", false));

      pkgs.forEach(p => Ember.set(p, "shared", on));
    }
  }
});
