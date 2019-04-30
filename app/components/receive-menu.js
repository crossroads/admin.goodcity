import { debounce } from "@ember/runloop";
import $ from "jquery";
import { computed } from "@ember/object";
import { equal } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Component from "@ember/component";
import { getOwner } from "@ember/application";
import AjaxPromise from "../utils/ajax-promise";

export default Component.extend({
  hidden: true,
  packageId: null,
  store: service(),
  messageBox: service(),
  displayUserPrompt: false,

  isReceived: equal("package.state", "received"),
  isMissing: equal("package.state", "missing"),

  allowLabelPrint: computed(
    "isReceived",
    "package.inventoryNumber",
    function() {
      return this.get("isReceived") && this.get("package.inventoryNumber");
    }
  ),

  preventEdit: computed(
    "package.{hasAllPackagesDispatched,hasAllPackagesDesignated}",
    function() {
      let pkg = this.get("store").peekRecord("package", this.get("packageId"));
      return (
        pkg.get("hasAllPackagesDispatched") ||
        pkg.get("hasAllPackagesDesignated")
      );
    }
  ),

  offer: computed("packageId", function() {
    return this.get("store").peekRecord("offer", this.get("package.offerId"));
  }),

  package: computed("packageId", function() {
    return this.get("store").peekRecord("package", this.get("packageId"));
  }),

  currentUrl: computed("packageId", function() {
    return getOwner(this)
      .lookup("router:main")
      .get("url");
  }),

  isFirstReceivingPackage: computed("package", function() {
    var offerPackages = this.get("offer.packages");
    return (
      offerPackages.get("length") ===
        offerPackages.filterBy("state", "expecting").length &&
      !this.get("offer.isReceiving")
    );
  }),

  updatePackage: function(action) {
    var loadingView = getOwner(this)
      .lookup("component:loading")
      .append();
    var pkg = this.get("package");
    action(pkg);
    pkg
      .save()
      .then(() => {
        loadingView.destroy();
        getOwner(this)
          .lookup("controller:review_offer")
          .set(
            "displayCompleteReceivePopup",
            this.get("offer.readyForClosure")
          );
      })
      .catch(error => {
        loadingView.destroy();
        var errorMessage = pkg.get("errors.firstObject.message");
        var matchFound = ["Connection error", "Dispatched"].some(
          v => errorMessage.indexOf(v) >= 0
        );
        if (matchFound) {
          this.get("messageBox").alert(
            pkg.get("errors.firstObject.message"),
            () => {
              pkg.rollbackAttributes();
            }
          );
        } else {
          pkg.rollbackAttributes();
          throw error;
        }
      });
  },

  i18n: service(),

  deliveredOptions: computed(function() {
    return [
      {
        value: "Unknown",
        name: this.get("i18n").t("mark_received.unknown")
      },
      {
        value: "Gogovan",
        name: this.get("i18n").t("mark_received.gogovan")
      },
      {
        value: "Alternate",
        name: this.get("i18n").t("mark_received.crossroads_truck")
      },
      {
        value: "Drop Off",
        name: this.get("i18n").t("mark_received.dropped_off")
      }
    ];
  }),

  deliveredBy: computed("offer.deliveredBy", function() {
    return this.get("offer.deliveredBy");
  }),

  confirmReceivingEvent: null,

  toggleItemClass() {
    var item = this.get("package");
    $(".receive-options." + item.id).toggleClass("hidden");
    $(".options-link-open." + item.id).toggleClass("hidden");
  },

  actions: {
    toggle(hidden) {
      this.set("hidden", hidden);
      var item = this.get("package");
      var itemOptionsLink = $(".options-link-open." + item.id)[0];
      var optionsLink = $(".options-link-open.hidden");
      if (optionsLink.length) {
        $(".receive-options")
          .not(".hidden")
          .toggleClass("hidden");
        $(".options-link-open.hidden").toggleClass("hidden");
        return false;
      } else if (itemOptionsLink) {
        this.toggleItemClass();
        return false;
      } else {
        return true;
      }
    },

    checkReceiving(event) {
      if (this.get("offer.isFinished")) {
        this.get("messageBox").confirm(
          this.get("i18n").t("review_offer.confirm_receiving_message"),
          () => this.send("applyReceiving", event, false)
        );
      } else {
        this.send("applyReceiving", event);
      }
    },

    applyReceiving(event, allow_event = true) {
      if (!this.get("isFirstReceivingPackage") && allow_event) {
        return this.send(event);
      }
      this.set("confirmReceivingEvent", event);
      this.set("displayUserPrompt", true);
    },

    confirmReceiving() {
      var offer = this.get("offer");
      offer.set("deliveredBy", this.get("deliveredBy.value"));
      offer.set("state_event", "start_receiving");
      offer
        .save()
        .catch(error => {
          offer.rollback();
          throw error;
        })
        .then(() => this.send(this.get("confirmReceivingEvent")));
    },

    missing() {
      if (!this.get("isMissing")) {
        this.updatePackage(p => {
          p.set("state", "missing");
          p.set("state_event", "mark_missing");
          p.set("location", null);
        });
      }
    },

    receive() {
      if (!this.get("isReceived")) {
        this.updatePackage(p => {
          p.set("inventoryNumber", null);
          p.set("state", "received");
          p.set("state_event", "mark_received");
        });
      }
    },

    receiveInInventory() {
      if (!this.get("isReceived")) {
        this.get("router").transitionTo(
          "receive_package",
          this.get("packageId")
        );
      }
    },

    printBarcode() {
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      new AjaxPromise(
        `/packages/${this.get("packageId")}/print_inventory_label`,
        "GET",
        this.get("session.authToken")
      )
        .catch(xhr => {
          if (xhr.status !== 200) {
            var errors = xhr.responseText;
            try {
              errors = $.parseJSON(xhr.responseText).errors;
            } catch (err) {
              console.log(err);
            }
            this.get("messageBox").alert(errors);
          } else {
            throw xhr;
          }
        })
        .finally(() => {
          loadingView.destroy();
          this.send("toggle", true);
          $(`#printer_message_${this.get("package.id")}`).css({
            display: "block"
          });
          debounce(this, this.hidePrinterMessage, 200);
        });
    }
  },

  hidePrinterMessage() {
    $(`#printer_message_${this.get("package.id")}`).fadeOut(3000);
  }
});
