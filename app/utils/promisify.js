import DS from "ember-data";

/**
 * A helper utility to work with promises in computed property
 * @param {Function} cb
 */
export default function promosify(cb = null) {
  if (!cb) {
    return;
  }

  return DS.PromiseObject.create({
    promise: cb()
  });
}
