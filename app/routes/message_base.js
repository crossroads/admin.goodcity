import AuthorizeRoute from "goodcity/routes/authorize";

export default AuthorizeRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);
    controller.set("isActive", true);
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set("isActive", false);
    }
  }
});
