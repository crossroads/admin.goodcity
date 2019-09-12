import FactoryGuy from "ember-data-factory-guy";

FactoryGuy.define("company", {
  sequences: {
    name: function(num) {
      return "company" + num;
    }
  },
  default: {
    crmId: 1
  }
});
export default {};
