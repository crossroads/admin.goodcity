import FactoryGuy from "ember-data-factory-guy";
import mobile from "./mobile";

FactoryGuy.define("user_profile", {
  sequences: {
    collectionFirstName: function(num) {
      return "Daniel" + num;
    },
    collectionLastName: function(num) {
      return "Stepp" + num;
    }
  },
  default: {
    firstName: FactoryGuy.generate("collectionFirstName"),
    lastName: FactoryGuy.generate("collectionLastName"),
    printer: FactoryGuy.belongsTo("printer")
  },
  with_non_hk_mobile: {
    mobile: FactoryGuy.generate(mobile.nonHongKong),
    district_id: 1
  },
  with_hk_mobile: {
    mobile: FactoryGuy.generate(mobile.hongKong),
    district_id: 2
  }
});
export default {};
