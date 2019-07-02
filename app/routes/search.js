import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  setupController(controller, model = {}) {
    controller.on();
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.off();
    }
  }
});
