import Ember from "ember";
import config from "../../config/environment";
import AsyncTasksMixin from "../../mixins/async_tasks";

export default Ember.Controller.extend(AsyncTasksMixin, {
  donor: null,
  currentOffer: null,
  offersCount: Ember.computed.alias("model.length"),
  goodcityNumber: config.APP.GOODCITY_NUMBER,
  internetCallStatus: Ember.inject.controller(),

  displayCompanyOptions: false,
  displayAltPhoneOptions: false,
  displayDonorMobileOptions: false,
  displayDonorOptions: false,

  stickyNote: {
    showCallToAction: true
  },

  districts: Ember.computed(function() {
    return this.store.peekAll("district").sortBy("name");
  }),

  showNoteCallToAction: Ember.computed(
    "currentOffer.notes",
    "stickyNote.showCallToAction",
    function () {
      const note = this.get("currentOffer.notes");
      return !note && this.get("stickyNote.showCallToAction");
    }
  ),

  stickNoteChanged: Ember.computed("currentOffer.notes", function () {
    const changes = this.get("currentOffer").changedAttributes().notes;
    return changes && changes.some(it => it);
  }),

  displayNumber: Ember.computed("donor.mobile", function () {
    const donor = this.get("donor");
    if (!donor) {
      return "";
    }

    const num = donor.get("mobile").replace(/\+852/, "");
    return num.length > 4 ? num.substr(0, 4) + " " + num.substr(4) : num;
  }),

  donorOffers: Ember.computed("model", function () {
    return this.get("model").rejectBy("id", this.get("currentOffer.id"));
  }),

  receivedOffers: Ember.computed("model", function () {
    return this.get("model").filterBy("isReceived", true).length;
  }),

  actions: {
    setOfferDistrict(district) {
      this.runTask(() => {
        const offer = this.get('currentOffer')
        offer.set('district', district);
        return offer.save();
      })
    },

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

