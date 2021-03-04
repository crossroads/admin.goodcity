import Ember from "ember";
import AsyncTasksMixin from "../../../mixins/async_tasks";
import { SHAREABLE_TYPES } from "../../../models/shareable";
import config from "../../../config/environment";

export default Ember.Controller.extend(AsyncTasksMixin, {
  parent: Ember.inject.controller("review_offer.share"),
  isShared: Ember.computed.alias("parent.isShared"),
  offer: Ember.computed.alias("parent.offer"),
  offerShareable: Ember.computed.alias("parent.offerShareable"),
  shareables: Ember.computed.alias("parent.shareables"),
  offerService: Ember.inject.service(),
  sharingService: Ember.inject.service(),

  allMessages: Ember.computed(function() {
    return this.get("store").peekAll("message");
  }),

  threadUserIds: Ember.computed(
    "offer.id",
    "offer.createdById",
    "allMessages.[]",
    "allMessages.length",
    "allMessages.@each.{senderId,recipientId}",
    function() {
      return this.get("allMessages")
        .filterBy("offerId", this.get("offer.id"))
        .filter(m =>
          // Messages from staff will have a recipient_id, but charity messages wont
          m.get("fromCharity")
        )
        .mapBy("senderId")
        .uniq();
    }
  ),

  messageThreads: Ember.computed(
    "offer.id",
    "offer.createdById",
    "threadUserIds",
    "threadUserIds.length",
    "allMessages.[]",
    "allMessages.length",
    "allMessages.@each.{senderId,recipientId}",
    function() {
      return this.get("threadUserIds").map(uid => {
        const messages = this.get("offer.messages")
          .sortBy("createdAt")
          .filter(
            m => m.get("senderId") === uid || m.get("recipientId") === uid
          );
        const lastMessage = messages.get("lastObject");

        return {
          userId: uid,
          user: this.get("store").peekRecord("user", uid),
          lastMessage: lastMessage,
          unreadCount: messages.reduce((sum, m) => {
            return sum + (m.get("isRead") ? 0 : 1);
          }, 0),
          organisation: this.organisationOf(uid)
        };
      });
    }
  ),

  organisationOf(userId) {
    const ou = this.get("store")
      .peekAll("organisations_user")
      .findBy("userId", userId);

    return ou && ou.get("organisation");
  },

  charitiesWebsiteURL: config.BROWSE_APP_HOST_URL,

  sharingModes: Object.freeze({
    PRIVATE: "private",
    PUBLIC: "public",
    PUBLIC_LISTED: "public_listed"
  }),

  sharingEnabled: Ember.computed("selectedSharingMode", function() {
    return this.get("selectedSharingMode") !== this.get("sharingModes.PRIVATE");
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
      notesZhTw: this.get("notesZh")
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

    openChat(recipientId) {
      this.replaceRoute("review_offer.share.chat", recipientId);
    },

    startEdit() {
      this.modalCatch(() => {
        const shareable = this.get("offerShareable");
        this.set("selectedSharingMode", this.computeSharingMode(shareable));
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
    },

    toggleSelectAllPackages() {
      const pkgs = this.get("packageList");
      const on = Boolean(pkgs.findBy("shared", false));

      pkgs.forEach(p => Ember.set(p, "shared", on));
    }
  }
});
