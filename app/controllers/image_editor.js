import Ember from "ember";
import { translationMacro as t } from "ember-i18n";
import config from "../config/environment";
import AsyncMixin from "../mixins/async_tasks";
import utils from "../utils/utility-methods";

/**
 * Image Editor
 *
 * This is based on the old `edit_images` controller (shared.goodcity)
 * This version supports any time of imageable record. In our case Item and Package
 *
 */
export default Ember.Controller.extend(AsyncMixin, {
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),
  cordova: Ember.inject.service(),
  imageService: Ember.inject.service(),
  previewImage: null,
  addPhotoLabel: t("edit_images.add_photo"),
  isReady: false,
  isExpanded: false,
  backBtnVisible: true,
  loadingPercentage: t("edit_images.image_uploading"),
  uploadedFileDate: null,

  record: Ember.computed.alias("model"),

  initActionSheet(onSuccess) {
    return window.plugins.actionsheet.show(
      {
        buttonLabels: [
          this.locale("edit_images.upload").string,
          this.locale("edit_images.camera").string,
          this.locale("edit_images.cancel").string
        ]
      },
      function(buttonIndex) {
        if (buttonIndex === 1) {
          navigator.camera.getPicture(onSuccess, null, {
            quality: 40,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
          });
        }
        if (buttonIndex === 2) {
          navigator.camera.getPicture(onSuccess, null, {
            correctOrientation: true,
            quality: 40,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA
          });
        }
        if (buttonIndex === 3) {
          window.plugins.actionsheet.hide();
        }
      }
    );
  },

  previewMatchesFavourite: Ember.computed(
    "previewImage",
    "favouriteImage",
    function() {
      return this.get("previewImage") === this.get("favouriteImage");
    }
  ),

  noImage: Ember.computed.empty("images"),

  images: Ember.computed("record.images.length", function() {
    //The reason for sorting is because by default it's ordered by favourite
    //then id order. If another image is made favourite then deleted the first image
    //by id order is made favourite which can be second image in list which seems random.

    //Sort by id ascending except place new images id = 0 at end
    return (this.getWithDefault("record.images", []) || Ember.A())
      .toArray()
      .sort(function(a, b) {
        a = parseInt(a.get("id"), 10);
        b = parseInt(b.get("id"), 10);
        if (a === 0) {
          return 1;
        }
        if (b === 0) {
          return -1;
        }
        return a - b;
      });
  }),

  supportsFavouriteImage: Ember.computed("record", function() {
    const record = this.get("record");

    return utils.supportsField(record, "favouriteImageId");
  }),

  favouriteImage: Ember.computed(
    "images.@each.favourite",
    "supportsFavouriteImage",
    "record.favouriteImageId",
    function() {
      return this.get("supportsFavouriteImage")
        ? this.get("record.favouriteImage")
        : this.get("images").findBy("favourite");
    }
  ),

  initPreviewImage: Ember.on(
    "init",
    Ember.observer("record", "images.[]", function() {
      var image = this.get("images.firstObject");
      if (image) {
        this.send("setPreview", image);
      }
    })
  ),

  //css related
  previewImageBgCss: Ember.computed(
    "previewImage",
    "isExpanded",
    "previewImage.angle",
    {
      get() {
        var css = this.get("instructionBoxCss");
        if (!this.get("previewImage")) {
          return css;
        }

        var imgTag = new Image();
        imgTag.onload = () => {
          var newCSS = new Ember.Handlebars.SafeString(
            css +
              "background-image:url(" +
              this.get("previewImage.imageUrl") +
              ");" +
              "background-size: " +
              (this.get("isExpanded") ? "contain" : "cover") +
              ";"
          );
          this.set("previewImageBgCss", newCSS);
        };

        imgTag.src = this.get("previewImage.imageUrl");

        return new Ember.Handlebars.SafeString(
          css +
            "background-image:url('assets/images/image_loading.gif');" +
            "background-size: 'inherit';"
        );
      },

      set(key, value) {
        return value;
      }
    }
  ),

  instructionBoxCss: Ember.computed("previewImage", "isExpanded", function() {
    var height = Ember.$(window).height() * 0.6;
    return new Ember.Handlebars.SafeString("min-height:" + height + "px;");
  }),

  thumbImageCss: Ember.computed(function() {
    var imgWidth = Math.min(120, Ember.$(window).width() / 4 - 14);
    return new Ember.Handlebars.SafeString(
      "width:" + imgWidth + "px; height:" + imgWidth + "px;"
    );
  }),

  locale(str) {
    return this.get("i18n").t(str);
  },

  confirmRemoveImage() {
    const deferred = Ember.RSVP.defer();

    this.get("messageBox").custom(
      this.locale("edit_images.delete_confirm"),
      this.locale("edit_images.cancel_item"),
      () => deferred.resolve(false),
      this.locale("edit_images.remove_image"),
      () => deferred.resolve(true)
    );

    return deferred.promise;
  },

  actions: {
    done() {
      window.history.back();
    },

    setPreview(image) {
      this.get("images").setEach("selected", false);
      image.set("selected", true);
      this.set("previewImage", image);
    },

    setFavourite() {
      const record = this.get("record");
      const img = this.get("previewImage");

      if (this.get("supportsFavouriteImage")) {
        record.set("favouriteImageId", img.get("id"));
        record.save().catch(error => {
          record.rollbackAttributes();
          throw error;
        });
      } else {
        this.get("images").setEach("favourite", false);
        this.get("previewImage").set("favourite", true);
        this.get("previewImage")
          .save()
          .catch(error => {
            this.get("images").forEach(i => i.rollbackAttributes());
            throw error;
          });
      }
    },

    deleteImage(img) {
      this.confirmRemoveImage().then(allowed => {
        if (!allowed) return;

        this.runTask(() => {
          img.deleteRecord();
          return img.save().then(i => {
            i.unloadRecord();
            this.initPreviewImage();
            if (!this.get("favouriteImage")) {
              this.send("setFavourite");
            }
          });
        }, this.ERROR_STRATEGIES.MODAL);
      });
    },

    expandImage() {
      this.toggleProperty("isExpanded");
    },

    //file upload
    triggerUpload() {
      // For Cordova application
      if (config.cordova.enabled) {
        var onSuccess = (function(_this) {
          return function(path) {
            console.log(path);
            var dataURL = "data:image/jpg;base64," + path;

            $("input[type='file']").fileupload(
              "option",
              "formData"
            ).file = dataURL;
            $("input[type='file']").fileupload("add", { files: [dataURL] });
          };
        })(this);

        this.initActionSheet(onSuccess);
      } else {
        // Trigger the file selection
        Ember.$("#photo-list input[type='file']").trigger("click");
      }
    },

    uploadReady() {
      this.set("isReady", true);
    },

    uploadStart(e, data) {
      this.set("uploadedFileDate", data);
      Ember.$(".loading-image-indicator").show();
    },

    cancelUpload() {
      if (this.get("uploadedFileDate")) {
        this.get("uploadedFileDate").abort();
      }
    },

    uploadProgress(e, data) {
      e.target.disabled = true; // disable image-selection
      var progress = parseInt((data.loaded / data.total) * 100, 10) || 0;
      this.set("addPhotoLabel", progress + "%");
      this.set(
        "loadingPercentage",
        this.get("i18n").t("edit_images.image_uploading") + progress + "%"
      );
    },

    uploadComplete(e) {
      e.target.disabled = false; // enable image-selection
      this.set("uploadedFileDate", null);
      Ember.$(".loading-image-indicator.hide_image_loading").hide();
      this.set("addPhotoLabel", this.get("i18n").t("edit_images.add_photo"));
      this.set(
        "loadingPercentage",
        this.get("i18n").t("edit_images.image_uploading")
      );
    },

    uploadSuccess(e, data) {
      const identifier =
        data.result.version +
        "/" +
        data.result.public_id +
        "." +
        data.result.format;
      const record = this.get("record");
      const favourite = this.get("images.length") === 0;

      this.runTask(() => {
        return this.get("imageService").createImage(record, identifier, {
          favourite
        });
      }, this.ERROR_STRATEGIES.MODAL);
    },

    rotateImageRight() {
      var angle = this.get("previewImage.angle");
      angle = (angle + 90) % 360;
      this.send("rotateImage", angle);
    },

    rotateImageLeft() {
      var angle = this.get("previewImage.angle");
      angle = (angle ? angle - 90 : 270) % 360;
      this.send("rotateImage", angle);
    },

    rotateImage(angle) {
      var image = this.get("previewImage");
      image.set("angle", angle);
      Ember.run.debounce(this, this.saveImageRotation, image, 400);
    }
  },

  saveImageRotation(image) {
    image.save();
  }
});
