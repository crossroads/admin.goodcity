import Ember from "ember";

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  filterService: Ember.inject.service(),

  pageTitle: Ember.computed(function() {
    return this.get("i18n").t("dashboard.title");
  })
});
