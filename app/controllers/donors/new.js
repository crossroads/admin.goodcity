import Ember from "ember";

export default Ember.Controller.extend({
  offerId: Ember.computed.alias("model.id"),
  selectedDistrict: null,
  firstName: null,
  lastName: null,
  email: null,
  mobilePhone: null,
  otherPhone: null,
  receiveEmail: false,
  districts: Ember.computed("model", function() {
    return this.store.peekAll("district").sortBy("name");
  }),

  userTitle: Ember.computed("selectedTitle", function() {
    let userTitle = this.get("model.createdBy.title");
    let titles = this.get("titles");

    if (userTitle) {
      let filteredUserTitle = titles.filter(title => userTitle === title.id);
      return {
        name: filteredUserTitle[0].name.string,
        id: userTitle
      };
    }
    return {
      name: titles.get("firstObject.name").string,
      id: "Mr"
    };
  }),

  selectedTitle: Ember.computed("userTitle", function() {
    return {
      name: this.get("userTitle.name"),
      id: this.get("userTitle.id")
    };
  }),

  titles: Ember.computed(function() {
    return [
      {
        name: "Mr",
        id: "Mr"
      },
      {
        name: "Mrs",
        id: "Mrs"
      },
      {
        name: "Miss",
        id: "Miss"
      },
      {
        name: "Ms",
        id: "Ms"
      }
    ];
  }),

  actions: {
    toggleReceiveEmail() {
      this.toggleProperty("receiveEmail");
    },

    resetInputs() {
      this.set("firstName", null);
      this.set("lastName", null);
      this.set("email", null);
      this.set("mobilePhone", null);
      this.set("receiveEmail", null);
      this.set("otherPhone", null);
    },

    saveDonorAndOffer() {
      let offer = this.get("model");
      let firstName = this.get("firstName");
      let lastName = this.get("lastName");
      let email = this.get("email");
      let mobile = this.get("mobilePhone")
        ? `+852${this.get("mobilePhone")}`
        : null;
      let receiveEmail = this.get("receiveEmail");
      let otherPhone = this.get("otherPhone")
        ? `+852${this.get("otherPhone")}`
        : null;
      let title = this.get("selectedTitle").id;

      let self = this;
      let donor = this.store.createRecord("user", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile,
        receiveEmail: receiveEmail,
        otherPhone: otherPhone,
        title: title
      });
      donor.save().then(function() {
        offer.set("createdBy", donor);
        offer.save().then(() => {
          self.transitionToRoute("review_offer.donor_details", offer.get("id"));
        });
      });
    }
  }
});
