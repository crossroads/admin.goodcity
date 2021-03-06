import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  packageService: Ember.inject.service(),
  i18n: Ember.inject.service(),
  defaultPackage: Ember.computed.alias("model.packageType"),
  item: Ember.computed.alias("model"),
  cordova: Ember.inject.service(),
  isPackageTypeChanged: false,

  isItemVanished: Ember.computed.or("item.isDeleted", "item.isDeleting"),

  showDeleteError: Ember.observer("item", "isItemVanished", function() {
    var currentRoute = this.get("application.currentRouteName");

    if (this.get("isItemVanished")) {
      if (currentRoute.indexOf("review_item") >= 0) {
        this.get("messageBox").alert(this.get("i18n").t("404_error"), () => {
          this.transitionToRoute("dashboard");
        });
      }
    }
  }),

  itemDescriptionPlaceholder: Ember.computed(function() {
    return this.get("i18n").t("items.add_item.description_placeholder").string;
  }),

  formData: Ember.computed("model.donorCondition", "model.donorDescription", {
    get: function() {
      return {
        donorConditionId: this.get("model.donorCondition.id"),
        donorDescription: this.get("model.donorDescription")
      };
    },
    set: function() {
      return {
        donorConditionId: this.get("model.donorCondition.id"),
        donorDescription: this.get("model.donorDescription")
      };
    }
  }),

  displayEditLink: Ember.computed("application.currentRouteName", function() {
    return this.get("application.currentRouteName").indexOf("accept") >= 0;
  }),

  isEditing: Ember.computed(
    "item",
    "item.donorDescription",
    "item.donorCondition",
    {
      get: function() {
        var item = this.get("item");
        var description = Ember.$.trim(item.get("donorDescription"));
        return !(item.get("donorCondition") && description.length > 0);
      },
      set: function(key, value) {
        return value;
      }
    }
  ),

  canCopyItem: Ember.computed("item.state", function() {
    const item = this.get("item");
    return !item.get("offer").get("isFinished") && item.get("state") != "draft";
  }),

  itemTypeId: Ember.computed("defaultPackage", {
    get: function() {
      return this.get("defaultPackage.id");
    },
    set: function(key, value) {
      return value;
    }
  }),

  itemType: Ember.computed("defaultPackage", {
    get: function() {
      return this.get("defaultPackage");
    },
    set: function(key, value) {
      return value;
    }
  }),

  itemTypes: Ember.computed(function() {
    return this.get("store")
      .peekAll("package_type")
      .sortBy("name");
  }),

  actions: {
    setEditing(value) {
      this.set("isEditing", value);
    },

    selectPackageType() {
      this.set("packageService.isPackageTypeOverlayVisible", true);
    },

    setPackaageType(pkgType) {
      this.set("model.packageType", pkgType);
    },

    copyItem() {
      var loadingView = getOwner(this)
        .lookup("component:loading")
        .append();
      var _this = this;
      var item = _this.get("model");
      var images = item.get("images");
      var promises = [];

      var newItem = _this.get("store").createRecord("item", {
        offer: item.get("offer"),
        donorCondition: item.get("donorCondition"),
        state: "draft",
        packageType: item.get("packageType"),
        donorDescription: item.get("donorDescription")
      });

      newItem.save().then(() => {
        images.forEach(function(image) {
          var newImage = _this.get("store").createRecord("image", {
            cloudinaryId: image.get("cloudinaryId"),
            item: newItem,
            favourite: image.get("favourite")
          });
          promises.push(newImage.save());
        });

        Ember.RSVP.all(promises).then(function() {
          loadingView.destroy();
          _this.transitionToRoute("item.image_editor", newItem, {
            queryParams: { forwardRoute: "review_item.accept" }
          });
        });
      });
    }
  }
});
