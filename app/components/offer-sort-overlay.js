import Ember from "ember";
import { offerSortingOptions } from "goodcity/config/offer-sorting-options";

export default Ember.Component.extend({
  filterService: Ember.inject.service(),
  sortTypes: offerSortingOptions
});
