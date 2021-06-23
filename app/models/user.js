import Ember from "ember";
import DS from "ember-data";
import Addressable from "goodcity/models/addressable";

var attr = DS.attr,
  belongsTo = DS.belongsTo,
  hasMany = DS.hasMany;

export default Addressable.extend({
  firstName: attr("string"),
  lastName: attr("string"),
  mobile: attr("string"),
  createdAt: attr("date"),
  userRoleIds: attr(""),
  email: attr(""),
  receiveEmail: attr(""),
  otherPhone: attr(""),
  title: attr(""),
  organisationsUsersIds: attr(),

  lastConnected: attr("date"),
  lastDisconnected: attr("date"),

  image: belongsTo("image", { async: false }),
  permission: belongsTo("permission", { async: true }),
  reviewedOffers: hasMany("offers", { inverse: "reviewedBy", async: false }),
  donations: hasMany("offers", { inverse: "createdBy", async: false }),
  printersUsers: hasMany("printersUsers", { async: false }),
  userRoles: hasMany("userRoles", { async: false }),
  organisationsUsers: hasMany("organisationsUsers", { async: false }),

  organisations: Ember.computed("organisationsUsersIds", function() {
    const ids = this.get("organisationsUsers").map(record =>
      record.get("organisationId")
    );
    return ids.map(id => this.store.peekRecord("organisation", id));
  }),

  organisation: Ember.computed("organisations.[]", function() {
    return this.get("organisations.firstObject");
  }),

  organisationStatus: Ember.computed("organisationsUsers.[]", function() {
    return this.get("organisationsUsers.firstObject.status");
  }),

  roles: Ember.computed("userRoles.[]", function() {
    var roles = [];
    this.get("userRoles").forEach(userRole => {
      roles.push(userRole.get("role"));
    });
    return roles;
  }),

  roleIds: Ember.computed("userRoles.[]", function() {
    return this.get("userRoles").getEach("roleId");
  }),

  i18n: Ember.inject.service(),

  isSupervisor: Ember.computed.equal("permission.name", "Supervisor"),

  nameInitial: Ember.computed("firstName", function() {
    return this.get("firstName")
      .charAt(0)
      .capitalize();
  }),

  roleInitials: Ember.computed("permission", function() {
    var permission = this.get("permission.name") || "Donor";
    return "(" + permission.capitalize().charAt(0) + ")";
  }),

  displayImageUrl: Ember.computed("image", function() {
    return (
      this.get("image.thumbImageUrl") || "assets/images/default_user_image.jpg"
    );
  }),

  hasImage: Ember.computed("image", {
    get: function() {
      return this.get("image.thumbImageUrl");
    },
    set: function(key, value) {
      return value;
    }
  }),

  fullName: Ember.computed("firstName", "lastName", function() {
    return this.get("firstName") + " " + this.get("lastName");
  }),

  onlineStatus: Ember.computed("lastConnected", "lastDisconnected", function() {
    if (!this.get("lastConnected") && !this.get("lastDisconnected")) {
      return this.get("i18n").t("not_connected");
    } else if (this.get("lastDisconnected") > this.get("lastConnected")) {
      return false;
    } else if (this.get("lastDisconnected") < this.get("lastConnected")) {
      return this.get("i18n").t("online");
    }
  })
});
