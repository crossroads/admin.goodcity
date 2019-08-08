import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  setupController(controller) {
    controller.on();
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.off();
    }
  }
});
