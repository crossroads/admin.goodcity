import Ember from "ember";
import { offerSortingOptions } from "goodcity/constants/offer-sorting-options";

export default Ember.Component.extend({
  filterService: Ember.inject.service(),

  sortTypes: offerSortingOptions
});
