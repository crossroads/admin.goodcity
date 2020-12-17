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

  isShared: Ember.computed(
    "offer.id",
    "allShareables.[]",
    "allShareables.@each.expiresAt",
    function() {
      return this.get("allShareables").find(sh => {
        return (
          sh.get("resourceType") == "Offer" &&
          sh.get("resourceId") == this.get("offer.id")
        );
      });
    }
  ),

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
        currentPath.indexOf(`offers/${this.get("offer.id")}`) >= 0
      ) {
        this.get("messageBox").alert(this.get("i18n").t("404_error"), () => {
          this.transitionToRoute("dashboard");
        });
      }
    }
  }),

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
      var offer = this.get("model");
      this.get("messageBox").custom(
        this.get("i18n").t("delete_confirm"),
        this.get("i18n").t("review_offer.options.yes"),
        () => {
          this.set("cancelByMe", true);
          this.runTask(offer.destroyRecord())
            .then(() => this.transitionToRoute(this.get("backLinkPath")))
            .catch(error => {
              offer.rollbackAttributes();
              throw error;
            })
            .finally(() => this.set("cancelByMe", false));
        },
        this.get("i18n").t("review_item.not_now"),
        null
      );
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
