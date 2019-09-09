export default Ember.Route.extend({
  model(params) {
    return this.modelFor("offer");
  },

  renderTemplate() {
    this.render("search_label", { controller: "offer.search_label" });
  }
});
