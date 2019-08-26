import FactoryGuy from "ember-data-factory-guy";
import "./item";
import "./package_type";
import "./location";

FactoryGuy.define("package", {
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id: FactoryGuy.generate("id"),
    quantity: 1,
    labels: 1,
    length: 10,
    width: 10,
    height: 10,
    item: FactoryGuy.belongsTo("item"),
    packageType: FactoryGuy.belongsTo("package_type"),
    location: FactoryGuy.belongsTo("location"),
    notes: "example"
  }
});

export default {};
