import Ember from "ember";
const { getOwner } = Ember;
import AjaxPromise from "../utils/ajax-promise";
import AsyncTasksMixin, { ERROR_STRATEGIES } from "../mixins/async_tasks";

export default Ember.Component.extend(AsyncTasksMixin, {
  hidden: true,
  packageId: null,
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  packageService: Ember.inject.service(),
  printerService: Ember.inject.service(),
  displayUserPrompt: false,

  isReceived: Ember.computed.equal("package.state", "received"),
  isMissing: Ember.computed.equal("package.state", "missing"),

  isReceivedWithoutInventory: Ember.computed(
    "package",
    "isReceived",
    function() {
      return this.get("isReceived") && !this.get("package.inventoryNumber");
    }
  ),

  allowLabelPrint: Ember.computed(
    "isReceived",
    "package.inventoryNumber",
    function() {
      return this.get("isReceived") && this.get("package.inventoryNumber");
    }
  ),

  preventEdit: Ember.computed(
    "package.hasAllPackagesDispatched",
    "package.hasAllPackagesDesignated",
    function() {
      let pkg = this.get("store").peekRecord("package", this.get("packageId"));
      return (
        pkg.get("hasAllPackagesDispatched") ||
        pkg.get("hasAllPackagesDesignated")
      );
    }
  ),

  offer: Ember.computed("packageId", function() {
    return this.get("store").peekRecord("offer", this.get("package.offerId"));
  }),

  package: Ember.computed("packageId", function() {
    return this.get("store").peekRecord("package", this.get("packageId"));
  }),

  currentUrl: Ember.computed("packageId", function() {
    return getOwner(this)
      .lookup("router:main")
      .get("url");
  }),

  isFirstReceivingPackage: Ember.computed("package", function() {
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

  i18n: Ember.inject.service(),

  deliveredOptions: Ember.computed(function() {
    return [
      { value: "Unknown", name: this.get("i18n").t("mark_received.unknown") },
      { value: "Gogovan", name: this.get("i18n").t("mark_received.gogovan") },
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

  deliveredBy: Ember.computed("offer.deliveredBy", function() {
    return this.get("offer.deliveredBy");
  }),

  confirmReceivingEvent: null,

  toggleItemClass() {
    var item = this.get("package");
    Ember.$(".receive-options." + item.id).toggleClass("hidden");
    Ember.$(".options-link-open." + item.id).toggleClass("hidden");
  },

  actions: {
    toggle(hidden) {
      this.set("hidden", hidden);
      var item = this.get("package");
      var itemOptionsLink = Ember.$(".options-link-open." + item.id)[0];
      var optionsLink = Ember.$(".options-link-open.hidden");
      if (optionsLink.length) {
        Ember.$(".receive-options")
          .not(".hidden")
          .toggleClass("hidden");
        Ember.$(".options-link-open.hidden").toggleClass("hidden");
        return false;
      } else if (itemOptionsLink) {
        this.toggleItemClass();
        return false;
      } else {
        return true;
      }
    },

    checkReceiving(event, isEventPerformed) {
      if (!isEventPerformed) {
        if (this.get("offer.isFinished")) {
          this.get("messageBox").confirm(
            this.get("i18n").t("review_offer.confirm_receiving_message"),
            () => this.send("applyReceiving", event, false)
          );
        } else {
          this.send("applyReceiving", event);
        }
      }
    },

    inventorizeReceivedItem() {
      this.get("messageBox").confirm(
        this.get("i18n").t("receive.inventorize_warning"),
        () => this.send("assingInventoryNumber")
      );
    },

    async assingInventoryNumber() {
      const pkg = this.get("package");
      this.runTask(async () => {
        const inventoryNumber = await this.get(
          "packageService"
        ).generateInventoryNumber();
        pkg.set("inventoryNumber", inventoryNumber.inventory_number);
        pkg.set("state", "received");
        await pkg.save();
      }, ERROR_STRATEGIES.MODAL);
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
          offer.rollbackAttributes();
          throw error;
        })
        .then(() => this.send(this.get("confirmReceivingEvent")));
    },

    missing() {
      if (!this.get("isMissing")) {
        const pkg = this.get("package");
        this.runTask(
          this.get("packageService").markMissing(pkg),
          ERROR_STRATEGIES.MODAL
        );
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
      this.runTask(() => {
        this.get("printerService")
          .printInventoryLabel(this.get("packageId"))
          .then(() => {
            this.send("toggle", true);
            Ember.$(`#printer_message_${this.get("packageId")}`).css({
              display: "block"
            });
            Ember.run.debounce(this, this.hidePrinterMessage, 200);
          });
      }, ERROR_STRATEGIES.MODAL);
    }
  },

  hidePrinterMessage() {
    Ember.$(`#printer_message_${this.get("package.id")}`).fadeOut(3000);
  }
});
