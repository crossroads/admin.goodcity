import FactoryGuy from "ember-data-factory-guy";

FactoryGuy.define("user_role", {
  sequences: {
    id: function(num) {
      return num + 100;
    },
    userId: function(num) {
      return num + 500;
    },
    roleId: function(num) {
      return num + 500;
    }
  },
  default: {
    id: FactoryGuy.generate("id"),
    userId: FactoryGuy.generate("userId"),
    roleId: FactoryGuy.generate("roleId"),
    role: FactoryGuy.belongsTo("role"),
    user: FactoryGuy.belongsTo("user"),
    printer: FactoryGuy.belongsTo("printer")
  }
});
export default {};
