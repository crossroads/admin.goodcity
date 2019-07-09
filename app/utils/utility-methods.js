export default {
  arrayExists(arr) {
    return arr && arr.length;
  },

  exists(obj) {
    return obj;
  },

  stringifyArray(arr) {
    return Array.isArray(arr) ? arr.toString() : "";
  }
};
