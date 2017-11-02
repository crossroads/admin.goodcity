import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('packages_location',{
  sequences: {
    id: function(num) {
      return num + 100;
    },
    packageId: function(num) {
      return num + 500;
    }
  },
  default: {
    id:              FactoryGuy.generate('id'),
    packageId:       FactoryGuy.generate("packageId"),
    quantity:        1,
    package:         FactoryGuy.belongsTo('package'),
    location:        FactoryGuy.belongsTo('location')
  }
});
export default {};
