import Ember from "ember";
import AsyncTasksMixin, { ERROR_STRATEGIES } from "../mixins/async_tasks";
const { getOwner } = Ember;

export default Ember.Controller.extend(AsyncTasksMixin, {
  application: Ember.inject.controller(),
  offer: Ember.computed.alias("model"),
  isStartReviewClicked: false,
  i18n: Ember.inject.service(),
  offerService: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  backLinkPath: "",
  displayCompleteReviewPopup: false,
  displayCompleteReceivePopup: false,

  allShareables: Ember.computed(function() {
    return this.get("store").peekAll("shareable");
  }),

  allMessages: Ember.computed(function() {
    return this.get("store").peekAll("message");
  }),

  allOfferResponses: Ember.computed("offer", "allMessages.[]", function() {
    return this.get("store")
      .peekAll("offerResponse")
      .filterBy("offerId", this.get("offer.id"));
  }),

  offerShareable: Ember.computed(
    "offer.id",
    "allShareables.length",
    "allShareables.[]",
    "allShareables.@each.{id,active,publicUid}",
    function() {
      return this.get("allShareables").find(sh => {
        return (
          sh.get("resourceType") == "Offer" &&
          sh.get("resourceId") == this.get("offer.id") &&
          sh.get("active")
        );
      });
    }
  ),

  unreadCharityMessages: Ember.computed(
    "offer",
    "offerShareable",
    "offer.id",
    "allOfferResponses",
    "allMessages.[]",
    "allMessages.length",
    "allMessages.@each.{senderId,recipientId}",
    function() {
      var unreadMessageCount = 0;
      let offerResponse = this.get("allOfferResponses");

      offerResponse.uniq().map(uid => {
        let messages = this.get("allMessages").filter(
          m =>
            m.get("messageableType") === "OfferResponse" &&
            m.get("messageableId") === uid.id
        );

        unreadMessageCount += messages.reduce((sum, m) => {
          return sum + (m.get("isUnread") ? 1 : 0);
        }, 0);
      });

      return unreadMessageCount;
    }
  ),

  isShared: Ember.computed.alias("offerShareable"),

  displayOfferOptions: Ember.computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

  isMyOffer: Ember.computed("offer.reviewedBy", {
    get: function() {
      var currentUserId = this.session.get("currentUser.id");
      return this.get("offer.reviewedBy.id") === currentUserId;
    },
    set: function(key, value) {
      return value;
    }
  }),

  cancelByMe: Ember.computed("model", {
    get() {
      return false;
    },
    set(key, value) {
      return value;
    }
  }),

  isOfferVanished: Ember.computed.or("offer.isDeleted", "offer.isDeleting"),

  showDeleteError: Ember.observer("offer", "isOfferVanished", function() {
    var currentPath = window.location.href;

    if (this.get("isOfferVanished") && !this.get("cancelByMe")) {
      if (
        currentPath.indexOf("review_item") < 0 &&
        currentPath.indexOf("merge") < 0 &&
        currentPath.indexOf(`offers/${this.get("offer.id")}`) >= 0
      ) {
        this.get("messageBox").alert(this.get("i18n").t("404_error"), () => {
          this.transitionToRoute("dashboard");
        });
      }
    }
  }),

  deleteOffer(offer, path = this.get("backLinkPath")) {
    this.set("cancelByMe", true);
    this.runTask(offer.destroyRecord())
      .then(() => this.transitionToRoute(path))
      .catch(error => {
        offer.rollbackAttributes();
        throw error;
      })
      .finally(() => this.set("cancelByMe", false));
  },

  actions: {
    toggleOfferOptions() {
      this.toggleProperty("displayOfferOptions");
    },

    addItem() {
      const offer = this.get("offer");

      const task = this.get("offerService")
        .addNewItem(offer)
        .then(item => {
          this.transitionToRoute("item.image_editor", item, {
            queryParams: { forwardRoute: "review_item.accept" }
          });
        });

      this.runTask(task, this.ERROR_STRATEGIES.MODAL);
    },

    startReview() {
      if (this.get("isStartReviewClicked")) {
        return;
      }
      var offer = this.store.peekRecord("offer", this.get("offer.id"));
      this.set("isStartReviewClicked", true);
      var adapter = getOwner(this).lookup("adapter:application");
      var url = adapter.buildURL("offer", offer.get("id")) + "/review";

      adapter
        .ajax(url, "PUT")
        .then(data => this.store.pushPayload(data))
        .finally(() => this.set("isStartReviewClicked", false));
    },

    deleteOffer() {
      this.send("toggleOfferOptions");
      const offer = this.get("model");
      this.get("messageBox").custom(
        this.get("i18n").t("delete_confirm"),
        this.get("i18n").t("review_offer.options.yes"),
        () => {
          this.deleteOffer(offer);
        },
        this.get("i18n").t("review_item.not_now"),
        null
      );
    },

    transitionTo(path) {
      const offer = this.get("model");
      const items = offer.get("items");
      if (!items.length) {
        this.get("messageBox").custom(
          this.get("i18n").t("review_offer.empty_offer_message"),
          this.get("i18n").t("review_offer.options.yes"),
          () => {
            this.deleteOffer(offer, path);
          },
          this.get("i18n").t("review_item.not_now"),
          null
        );
      } else {
        this.transitionToRoute(path);
      }
    },

    reopenOffer() {
      this.runTask(async () => {
        await this.get("offerService").reopenOffer(this.get("model"));
        this.send("toggleOfferOptions");
      }, ERROR_STRATEGIES.MODAL);
    },

    resumeReceivingOffer() {
      this.runTask(async () => {
        await this.get("offerService").resumeReceiving(this.get("model"));
        this.set("displayOfferOptions", false);
      }, ERROR_STRATEGIES.MODAL);
    },

    submitOffer() {
      this.toggleProperty("displayOfferOptions");
      var offer = this.get("model");
      offer.setProperties({ state_event: "submit" });

      this.runTask(offer.save());
    }
  }
});
