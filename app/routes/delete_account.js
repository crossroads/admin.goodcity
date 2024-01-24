import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  renderTemplate() {
    this.render(); // default template
    this.render("appMenuList", {
      into: "delete_account",
      outlet: "appMenuList",
      controller: "offers"
    });
  },

  model() {
    return Ember.RSVP.hash({
      user: this.store.peekRecord("user", this.session.get("currentUser.id"))
    });
  }
});
