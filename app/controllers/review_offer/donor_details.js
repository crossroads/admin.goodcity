import { computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import Controller, { inject as controller } from "@ember/controller";
import config from "../../config/environment";
import AsyncTasksMixin from "../../mixins/async_tasks";

export default Controller.extend(AsyncTasksMixin, {
  donor: null,
  currentOffer: null,
  offersCount: alias("model.length"),
  goodcityNumber: config.APP.GOODCITY_NUMBER,
  internetCallStatus: controller(),

  displayCompanyOptions: false,
  displayAltPhoneOptions: false,
  displayDonorMobileOptions: false,
  displayDonorOptions: false,

  stickyNote: {
    showCallToAction: true
  },

  showNoteCallToAction: computed(
    "currentOffer.notes",
    "stickyNote.showCallToAction",
    function() {
      const note = this.get("currentOffer.notes");
      return !note && this.get("stickyNote.showCallToAction");
    }
  ),

  stickNoteChanged: computed("currentOffer.notes", function() {
    const changes = this.get("currentOffer").changedAttributes().notes;
    return changes && changes.some(it => it);
  }),

  displayNumber: computed("donor.mobile", function() {
    const donor = this.get("donor");
    if (!donor) {
      return "";
    }

    const num = donor.get("mobile").replace(/\+852/, "");
    return num.length > 4 ? num.substr(0, 4) + " " + num.substr(4) : num;
  }),

  donorOffers: computed("model", function() {
    return this.get("model").rejectBy("id", this.get("currentOffer.id"));
  }),

  receivedOffers: computed("model", function() {
    return this.get("model").filterBy("isReceived", true).length;
  }),

  actions: {
    toggleOptions(optionName) {
      let optionNames = [
        "displayCompanyOptions",
        "displayDonorMobileOptions",
        "displayAltPhoneOptions",
        "displayDonorOptions"
      ];
      optionNames.forEach(item => {
        if (item !== optionName && this.get(item)) {
          this.toggleProperty(item);
        }
      });
      this.toggleProperty(optionName);
    },

    removeCompany() {
      const offer = this.get("currentOffer");
      offer.set("companyId", null);
      offer.set("company", null);
      return offer.save();
    },

    removeContact() {
      const offer = this.get("currentOffer");
      offer.set("createdById", null);
      offer.set("createdBy", null);
      return offer.save();
    },

    hideNoteCallToAction() {
      this.set("stickyNote.showCallToAction", false);
    },
    showNoteCallToAction() {
      this.set("stickyNote.showCallToAction", true);
    },
    saveStickyNote() {
      if (!this.get("stickNoteChanged")) {
        return;
      }

      this.runTask(() => {
        const offer = this.get("currentOffer");
        return offer.save();
      }).then(() => {
        this.notifyPropertyChange("stickNoteChanged");
      });
    }
  }
});
