import FactoryGuy from "ember-data-factory-guy";

FactoryGuy.define("printers_user", {
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },
  default: {
    id: FactoryGuy.generate("id"),
    printer: FactoryGuy.belongsTo("printer"),
    user: FactoryGuy.belongsTo("user")
  }
});
export default {};
