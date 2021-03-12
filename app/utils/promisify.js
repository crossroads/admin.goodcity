import DS from "ember-data";

export default function promosify(cb = null) {
  if (!cb) {
    return;
  }

  return DS.PromiseObject.create({
    promise: cb()
  });
}
