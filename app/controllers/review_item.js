import { all } from "rsvp";
import $ from "jquery";
import { observer, computed } from "@ember/object";
import { alias, or } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import Controller, { inject as controller } from "@ember/controller";
import { getOwner } from "@ember/application";

export default Controller.extend({
  application: controller(),
  store: service(),
  messageBox: service(),
  i18n: service(),
  defaultPackage: alias("model.packageType"),
  item: alias("model"),
  cordova: service(),

  isItemVanished: or("item.isDeleted", "item.isDeleting"),

  showDeleteError: observer("item", "isItemVanished", function() {
    var currentRoute = this.get("application.currentRouteName");

    if (this.get("isItemVanished")) {
      if (currentRoute.indexOf("review_item") >= 0) {
        this.get("messageBox").alert(this.get("i18n").t("404_error"), () => {
          this.transitionToRoute("my_list");
        });
      }
    }
  }),

  itemDescriptionPlaceholder: computed(function() {
    return this.get("i18n").t("items.add_item.description_placeholder").string;
  }),

  formData: computed("model.donorCondition", "model.donorDescription", {
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

  displayEditLink: computed("application.currentRouteName", function() {
    return this.get("application.currentRouteName").indexOf("accept") >= 0;
  }),

  isEditing: computed("item", "item.donorDescription", "item.donorCondition", {
    get: function() {
      var item = this.get("item");
      var description = $.trim(item.get("donorDescription"));
      return !(item.get("donorCondition") && description.length > 0);
    },
    set: function(key, value) {
      return value;
    }
  }),

  itemTypeId: computed("defaultPackage", {
    get: function() {
      return this.get("defaultPackage.id");
    },
    set: function(key, value) {
      return value;
    }
  }),

  itemType: computed("defaultPackage", {
    get: function() {
      return this.get("defaultPackage");
    },
    set: function(key, value) {
      return value;
    }
  }),

  itemTypes: computed(function() {
    return this.get("store")
      .peekAll("package_type")
      .sortBy("name");
  }),

  actions: {
    setEditing(value) {
      this.set("isEditing", value);
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

        all(promises).then(function() {
          loadingView.destroy();
          _this.transitionToRoute("item.edit_images", newItem);
        });
      });
    }
  }
});
