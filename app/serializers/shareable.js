import Ember from "ember";
import _ from "lodash";
import JSONAPISerializer from "ember-data/serializers/json-api";

function addPolymorphismSupport(attributes) {
  if (attributes) {
    const { resource_type, resource_id } = attributes;
    attributes[`${resource_type.toLowerCase()}_id`] = resource_id;
  }
}

export default JSONAPISerializer.extend({
  keyForAttribute(attr) {
    return Ember.String.underscore(attr);
  },

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    const records = Array.isArray(payload.data) ? payload.data : [payload.data];

    _.map(records, "attributes").forEach(addPolymorphismSupport);

    return this._super(...arguments);
  },

  serialize(snapshot, options) {
    return {
      resource_id: snapshot.attr("resourceId"),
      resource_type: snapshot.attr("resourceType"),
      allow_listing: snapshot.attr("allowListing"),
      expires_at: snapshot.attr("expiresAt"),
      notes: snapshot.attr("notes"),
      notes_zh_tw: snapshot.attr("notesZhTw")
    };
  },

  serializeAttribute(snapshot, json, key, attributes) {
    if (snapshot.record.get("isNew") || snapshot.changedAttributes()[key]) {
      this._super(...arguments);
    }
  }
});
