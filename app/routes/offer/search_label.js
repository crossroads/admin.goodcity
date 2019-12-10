import Route from "@ember/routing/route";
export default Route.extend({
  model() {
    return this.modelFor("offer");
  },

  renderTemplate() {
    this.render("search_label", { controller: "offer.search_label" });
  }
});
