import DS from "ember-data";
import Ember from "ember";

var attr = DS.attr,
  hasMany = DS.hasMany,
  belongsTo = DS.belongsTo;

export default DS.Model.extend({
  name: attr("string"),
  otherTerms: attr("string"),
  code: attr("string"),
  isItemTypeNode: attr("boolean", { defaultValue: false }),
  visibleInSelects: attr("boolean", { defaultValue: false }),
  defaultChildPackages: attr("string"),
  otherChildPackages: attr("string"),

  location: belongsTo("location", { async: false }),
  packages: hasMany("package", { inverse: "packageType" }),
  packagesCount: Ember.computed.alias("packages.length"),

  defaultChildPackagesList: function() {
    return this._getPackages(this, this.get("defaultChildPackages"));
  },

  otherChildPackagesList: function() {
    return this._getPackages(this, this.get("otherChildPackages"));
  },

  allChildPackagesList: function() {
    return this.defaultChildPackagesList().concat(
      this.otherChildPackagesList()
    );
  },

  _getPackages: function(model, packageNames) {
    var array = (packageNames || "").split(",").filter(Boolean);
    var packages = [];
    var allPackageTypes = model.store.peekAll("packageType");
    array.forEach(function(type) {
      allPackageTypes.filter(function(pkg) {
        return pkg.get("code") === type ? packages.push(pkg) : "";
      });
    });
    return packages;
  }
});
