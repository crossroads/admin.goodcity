import FactoryGuy from "ember-data-factory-guy";

FactoryGuy.define("printer", {
  sequences: {
    id: function(num) {
      return num + 100;
    }
  },

  default: {
    id: FactoryGuy.generate("id"),
    name: "GoodcityINKJET"
  }
});

export default {};
