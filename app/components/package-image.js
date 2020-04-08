import Ember from "ember";

export default Ember.Component.extend({
  store: Ember.inject.service(),
  displayUserPrompt: false,
  selectedImage: null,

  // images: Ember.computed.alias("package.item.images"),

  currentPackage: Ember.computed("package", function() {
    return (
      this.get("store").peekRecord("package", this.get("package.id")) ||
      this.get("package")
    );
  }),

  images: Ember.computed(
    "currentPackage.item.images.[]",
    "currentPackage.images.[]",
    function() {
      const pkgImages = this.getWithDefault(
        "currentPackage.images",
        []
      ).toArray();

      return this.getWithDefault("currentPackage.item.images", [])
        .toArray()
        .filter(im => !pkgImages.findBy("cloudinaryId", im.get("cloudinaryId")))
        .concat(pkgImages);
    }
  ),

  actions: {
    selectImage(image) {
      this.set("selectedImage", image);
    },

    setPackageImage() {
      var image = this.get("selectedImage");
      this.get("package").favouriteImage = image;
      this.sendAction("setPackageImage", this.get("currentPackage"), image);
    },

    displayImagesListOverlay() {
      if (this.get("images").length > 0) {
        this.set("displayUserPrompt", true);
        var favouriteImage = this.get("package.favouriteImage");
        if (favouriteImage) {
          this.send("selectImage", favouriteImage);
        }
      }
    }
  }
});
