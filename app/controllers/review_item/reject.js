import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
const { getOwner } = Ember;

export default Ember.Controller.extend({
  reviewItem: Ember.inject.controller(),
  reviewOfferController: Ember.inject.controller("review_offer"),
  offer: Ember.inject.controller(),

  itemTypeId: Ember.computed.alias("reviewItem.itemTypeId"),
  itemId: Ember.computed.alias("reviewItem.model.id"),
  rejectionReasonId: Ember.computed.alias("model.rejectionReason.id"),
  rejectReasonPlaceholder: t("reject.custom_reason"),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  itemPackages: Ember.computed.alias("item.packages"),
  rejectMsg: "",

  rejectReason: Ember.computed("itemId", function() {
    return this.get("reviewItem.model.rejectReason");
  }),

  isBlank: Ember.computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

  noReasonSelected: Ember.computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

  selectedId: Ember.computed("rejectionReasonId", {
    get: function() {
      this.set("isBlank", false);
      let reasonId = this.get("rejectionReasonId");
      if (reasonId) {
        return reasonId;
      } else {
        if (this.get("rejectReason") && this.get("rejectReason").length) {
          return "-1";
        }
      }
    },
    set: function(key, value) {
      this.set("isBlank", false);
      this.set("noReasonSelected", false);
      return value;
    }
  }),

  rejectionOptions: Ember.computed(function() {
    return this.store.peekAll("rejection_reason").sortBy("id");
  }),

  cannotSave() {
    let pkgs = this.store
      .peekRecord("item", this.get("itemId"))
      .get("packages");
    if (
      pkgs &&
      pkgs.length &&
      (pkgs.get("firstObject.hasAllPackagesDesignated") ||
        pkgs.get("firstObject.hasAllPackagesDispatched"))
    ) {
      this.get("messageBox").alert(
        this.get("i18n").t("designated_dispatched_error")
      );
      return true;
    }
    return false;
  },

  rejectValidation(selectedReason, rejectProperties) {
    if (selectedReason === undefined) {
      this.set("noReasonSelected", true);
      return false;
    }
    if (
      selectedReason === "-1" &&
      Ember.$.trim(rejectProperties.rejectReason).length === 0
    ) {
      this.set("isBlank", true);
      return false;
    }
    return true;
  },

  rejectProperties() {
    return {
      rejectReason: this.get("rejectReason"),
      rejectionComments: this.get("rejectMsg"),
      rejectionReason: this.store.peekRecord(
        "rejection_reason",
        this.get("selectedId")
      ),
      state_event: "reject",
      id: this.get("itemId"),
      offer: this.get("offer.model"),
      packageType: this.store.peekRecord("packageType", this.get("itemTypeId"))
    };
  },

  actions: {
    setRejectOption() {
      this.set("selectedId", "-1");
    },

    setMessage(message) {
      this.set("rejectMsg", message);
    },

    rejectItem() {
      if (this.get("itemId") && this.cannotSave()) {
        return false;
      }
      let selectedReason = this.get("selectedId");
      let rejectProperties = this.rejectProperties();

      if (!this.rejectValidation(selectedReason, rejectProperties)) {
        return false;
      }

      if (selectedReason !== "-1") {
        rejectProperties.rejectReason = null;
        this.set("rejectReason", null);
      }

      let offer = this.get("offer.model");

      let saveItem = () => {
        let loadingView = getOwner(this)
          .lookup("component:loading")
          .append();
        let item = this.store.peekRecord("item", this.get("itemId"));
        item.setProperties(rejectProperties);

        // Save changes to Item
        item
          .save()
          .then(() => {
            this.transitionToRoute("review_offer.items");
            this.get("reviewOfferController").set(
              "displayCompleteReviewPopup",
              offer.get("allItemsReviewed") && offer.get("isUnderReview")
            );
          })
          .catch(error => {
            if (item) {
              item.rollback();
            }
            if (
              error.errors instanceof Array &&
              error.errors.filter(e => !!e["requires_gogovan_cancellation"])
                .length > 0
            ) {
              return this.transitionToRoute("offer.cancel_gogovan", offer);
            }
            throw error;
          })
          .finally(() => loadingView.destroy());
      };

      // if rejecting last accepted item but gogovan is booked display gogovan cancellation page
      let gogovanOrder = offer.get("delivery.gogovanOrder");
      let itemIsLastAccepted = offer
        .get("approvedItems")
        .every(i => i.id === this.get("itemId"));

      if (itemIsLastAccepted && gogovanOrder) {
        if (gogovanOrder.get("isPickedUp")) {
          this.get("messageBox").alert(
            this.get("i18n").t("reject.cannot_reject_error")
          );
        } else {
          this.get("messageBox").confirm(
            this.get("i18n").t("reject.cancel_gogovan_confirm"),
            () => {
              if (gogovanOrder.get("isActive")) {
                this.transitionToRoute("offer.cancel_gogovan", offer);
              } else {
                saveItem();
              }
            }
          );
        }
      } else {
        saveItem();
      }
    }
  }
});
