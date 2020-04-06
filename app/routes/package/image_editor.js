import AuthorizeRoute from "../authorize";

export default AuthorizeRoute.extend({
  controllerName: "image_editor",

  renderTemplate() {
    this.render("image_editor");
  }
});
