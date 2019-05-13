import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@ember/component";

export default Component.extend({
  i18n: service(),

  displayCloseOfferAction: computed(
    "offer.{allItemsRejected,state}",
    function() {
      return this.get("offer.allItemsRejected") && !this.get("offer.isClosed");
    }
  ),

  locale: function(text) {
    return this.get("i18n").t(text);
  },

  transportStatus: computed(
    "offer.{delivery,state,delivery.gogovanOrder.status,delivery.deliveryType}",
    function() {
      var message,
        delivery = this.get("offer.delivery");

      if (delivery.get("isAlternate")) {
        message = this.locale("offer.offer_details.is_collection");
      } else if (delivery.get("isDropOff")) {
        message = this.locale("offer.offer_details.is_drop_off");
      } else if (delivery.get("isGogovan")) {
        if (delivery.get("gogovanOrder.isActive")) {
          message = this.locale("offer.offer_details.is_gogovan_confirm");
        } else if (delivery.get("gogovanOrder.isCompleted")) {
          message = this.locale("offer.offer_details.driver_completed");
        } else {
          message = this.locale("offer.offer_details.is_gogovan_order");
        }
      }
      return message;
    }
  ),

  offerReadyForClosure: computed(
    "offer.{state,packages.@each.state}",
    function() {
      return (
        !this.get("offer.allItemsRejected") &&
        this.get("offer.allItemsReviewed") &&
        this.get("offer.state") !== "received" &&
        this.get("offer.packages.length") > 0 &&
        this.get("offer.packages")
          .filter(
            p => !p.get("item.isRejected") && p.get("state") === "expecting"
          )
          .get("length") === 0
      );
    }
  ),

  transportTime: computed(
    "offer.{delivery,state}",
    "offer.delivery.schedule.{dayTime,scheduledAt,slotName}",
    function() {
      var prefix, date, format, suffix;
      var offer = this.get("offer");

      date = offer.get("delivery.schedule.scheduledAt");
      format = "ddd Do MMM";

      if (offer.get("delivery.completedWithGogovan")) {
        date = offer.get("delivery.gogovanOrder.completedAt");
        format = "h:mm A, ddd Do MMM";
      } else if (offer.get("delivery.isGogovan")) {
        prefix = offer.get("delivery.schedule.slotName");
      } else {
        suffix = offer.get("delivery.schedule.dayTime");
      }

      return {
        prefix: prefix,
        date: date,
        suffix: suffix,
        format: format
      };
    }
  ),

  reviewStatusMessage: computed("offer.{nonEmptyOffer,state}", function() {
    var offer = this.get("offer");

    var prefix,
      suffix,
      className = "",
      date;
    if (!offer.get("nonEmptyOffer")) {
      prefix = this.locale("offer.empty_msg");
      className = "is-closed";
    } else if (offer.get("isReceiving")) {
      prefix = offer.get("i18n").t("review_offer.goods_start_receiving_by", {
        firstName: offer.get("receivedBy.firstName"),
        lastName: offer.get("receivedBy.lastName")
      });
      date = offer.get("startReceivingAt");
      className = "is-received";
    } else if (offer.get("isReceived")) {
      prefix = offer.get("i18n").t("review_offer.goods_received_by", {
        firstName: offer.get("createdBy.firstName"),
        lastName: offer.get("createdBy.lastName")
      });
      date = offer.get("receivedAt");
      className = "is-received";
    } else if (offer.get("isReviewed")) {
      prefix = offer.get("i18n").t("review_offer.reviewed");
      date = offer.get("reviewCompletedAt");
      className = "is-reviewed";
      suffix = offer.get("i18n").t("review_offer.plan_transport");
    } else if (offer.get("isClosed")) {
      prefix = offer.get("i18n").t("review_offer.offer_closed_by", {
        firstName: offer.get("closedBy.firstName"),
        lastName: offer.get("closedBy.lastName")
      });

      date = offer.get("reviewCompletedAt");
      className = "is-closed";
    } else if (offer.get("isInactive")) {
      prefix = offer.get("i18n").t("review_offer.inactive_offer");
      className = "is-closed";
    } else if (offer.get("isUnderReview")) {
      prefix = offer.get("i18n").t("review_offer.review_started_by", {
        firstName: offer.get("reviewedBy.firstName"),
        lastName: offer.get("reviewedBy.lastName")
      });
      date = offer.get("reviewedAt");
      className = "is-under-review";
    }

    return {
      prefix: prefix,
      date: date,
      suffix: suffix,
      className: className
    };
  }),

  actions: {
    startReview() {
      this.startReview();
    }
  }
});
