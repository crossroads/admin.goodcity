import _ from "lodash";

/**
 *
 * @export
 * @param {Model|string} modelOrId
 * @returns {string}
 */
export function toID(modelOrId) {
  if (modelOrId.get) {
    return modelOrId.get("id");
  }
  return modelOrId;
}
