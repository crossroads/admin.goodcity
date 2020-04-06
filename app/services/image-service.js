import Ember from "ember";
import ApiBaseService from "./api-base-service";
import _ from "lodash";

const ID = record => {
  switch (typeof record) {
    case "string":
    case "number":
      return record;
    default:
      return record.get("id");
  }
};

export default ApiBaseService.extend({
  store: Ember.inject.service(),

  createImage(imageableRecord, cloudinaryId, params = {}) {
    const modelName = imageableRecord.get("constructor.modelName");

    return this.POST(
      `/images`,
      {
        image: {
          imageable_type: _.upperFirst(_.camelCase(modelName)),
          imageable_id: imageableRecord.get("id"),
          cloudinary_id: cloudinaryId,
          favourite: _.get(params, "favourite", false)
        }
      },
      { persist: true }
    ).then(data => {
      const id = Number(data["image"]["id"]);
      const img = this.get("store").peekRecord("image", id);

      imageableRecord.getWithDefault("images", []).pushObject(img);

      return img;
    });
  }
});
