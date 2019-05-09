import $ from "jquery";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { alias } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import { getOwner } from "@ember/application";
import { translationMacro as t } from "ember-i18n";

export default Controller.extend({
  reviewItem: controller(),
  reviewOfferController: controller("review_offer"),
  offer: controller(),

  itemTypeId: alias("reviewItem.itemTypeId"),
  itemId: alias("reviewItem.model.id"),
  rejectionReasonId: alias("model.rejectionReason.id"),
  rejectReasonPlaceholder: t("reject.custom_reason"),
  messageBox: service(),
  i18n: service(),
  itemPackages: alias("item.packages"),

  rejectReason: computed("itemId", {
    get: function() {
      return this.get("reviewItem.model.rejectReason");
    },
    set: function(key, value) {
      return value;
    }
  }),

  isBlank: computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

  noReasonSelected: computed({
    get: function() {
      return false;
    },
    set: function(key, value) {
      return value;
    }
  }),

  selectedId: computed("rejectionReasonId", {
    get: function() {
      // eslint-disable-next-line ember/no-side-effects
      this.set("isBlank", false);
      var reasonId = this.get("rejectionReasonId");
      if (reasonId) {
        return reasonId;
      } else {
        if (this.get("rejectReason") && this.get("rejectReason").length > 0) {
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

  rejectionOptions: computed(function() {
    return this.store.peekAll("rejection_reason").sortBy("id");
  }),

  cannotSave() {
    var pkgs = this.store
      .peekRecord("item", this.get("itemId"))
      .get("packages");
    if (
      pkgs &&
      pkgs.length > 0 &&
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
      $.trim(rejectProperties.rejectReason).length === 0
    ) {
      this.set("isBlank", true);
      return false;
    }
    return true;
  },

  actions: {
    setRejectOption() {
      this.set("selectedId", "-1");
    },

    rejectItem() {
      if (this.get("itemId") && this.cannotSave()) {
        return false;
      }
      var selectedReason = this.get("selectedId");
      var rejectProperties = this.getProperties("rejectReason");
      if (!this.rejectValidation(selectedReason, rejectProperties)) {
        return false;
      }

      if (selectedReason !== "-1") {
        rejectProperties.rejectReason = null;
        this.set("rejectReason", null);
      }

      var offer = this.get("offer.model");

      var saveItem = () => {
        var loadingView = getOwner(this)
          .lookup("component:loading")
          .append();
        rejectProperties.rejectionReason = this.store.peekRecord(
          "rejection_reason",
          selectedReason
        );
        rejectProperties.state_event = "reject";
        rejectProperties.id = this.get("itemId");

        rejectProperties.offer = offer;
        rejectProperties.packageType = this.store.peekRecord(
          "packageType",
          this.get("itemTypeId")
        );

        var item = this.store.peekRecord("item", this.get("itemId"));
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
      var gogovanOrder = offer.get("delivery.gogovanOrder");
      var itemIsLastAccepted = offer
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
