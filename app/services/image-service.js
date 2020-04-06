import ApiBaseService from "./api-base-service";
import _ from "lodash";

export default ApiBaseService.extend({
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
