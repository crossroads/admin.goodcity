import { computed, observer } from "@ember/object";
import { inject as service } from "@ember/service";
import { alias, or } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import { getOwner } from "@ember/application";

export default Controller.extend({
  application: controller(),
  offer: alias("model"),
  isStartReviewClicked: false,
  i18n: service(),
  messageBox: service(),
  backLinkPath: "",
  displayCompleteReviewPopup: false,
  displayCompleteReceivePopup: false,

  displayOfferOptions: computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

  isMyOffer: computed("offer.reviewedBy", {
    get: function() {
      var currentUserId = this.session.get("currentUser.id");
      return this.get("offer.reviewedBy.id") === currentUserId;
    },
    set: function(key, value) {
      return value;
    }
  }),

  cancelByMe: computed("model", {
    get() {
      return false;
    },
    set(key, value) {
      return value;
    }
  }),

  isOfferVanished: or("offer.isDeleted", "offer.isDeleting"),

  showDeleteError: observer("offer", "isOfferVanished", function() {
    var currentPath = window.location.href;

    if (this.get("isOfferVanished") && !this.get("cancelByMe")) {
      if (
        currentPath.indexOf("review_item") < 0 &&
        currentPath.indexOf(`offers/${this.get("offer.id")}`) >= 0
      ) {
        this.get("messageBox").alert(this.get("i18n").t("404_error"), () => {
          this.transitionToRoute("my_list");
        });
      }
    }
  }),

  actions: {
    toggleOfferOptions() {
      this.toggleProperty("displayOfferOptions");
    },

    addItem() {
      var draftItemId =
        this.get("model.items")
          .filterBy("state", "draft")
          .get("firstObject.id") || "new";
      this.transitionToRoute("item.edit_images", draftItemId);
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

    cancelOffer() {
      this.send("toggleOfferOptions");
      var offer = this.get("model");
      this.get("messageBox").custom(
        this.get("i18n").t("delete_confirm"),
        this.get("i18n").t("review_offer.options.yes"),
        () => {
          this.set("cancelByMe", true);
          var loadingView = getOwner(this)
            .lookup("component:loading")
            .append();
          offer
            .destroyRecord()
            .then(() => {
              this.transitionToRoute(this.get("backLinkPath"));
            })
            .catch(error => {
              offer.rollback();
              throw error;
            })
            .finally(() => {
              loadingView.destroy();
              this.set("cancelByMe", false);
            });
        },
        this.get("i18n").t("review_item.not_now"),
        null
      );
    },

    submitOffer() {
      this.toggleProperty("displayOfferOptions");
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var offer = this.get("model");
      offer.setProperties({ state_event: "submit" });

      offer.save().finally(() => loadingView.destroy());
    }
  }
});
