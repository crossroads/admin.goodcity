import _ from "lodash";

export default {
  arrayExists(arr) {
    return arr && arr.length;
  },

  exists(obj) {
    return obj;
  },

  stringifyArray(arr) {
    return Array.isArray(arr) ? arr.toString() : "";
  },

  supportsField(record, field) {
    const fields = record.get("constructor.attributes");
    return fields.has(_.camelCase(field));
  }
};
