import FactoryGuy from "ember-data-factory-guy";
var conditions = ["New", "Lightly Used", "Heavily Used", "Broken"];

FactoryGuy.define("donor_condition", {
  default: {
    name: FactoryGuy.generate(function(num) {
      return conditions[num] + num;
    })
  }
});

export default {};
