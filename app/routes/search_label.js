import AuthorizeRoute from "./authorize";

export default AuthorizeRoute.extend({
  backLinkPath: Ember.computed.localStorage(),

  afterModel(model, transition) {
    var pkgs = model.get("packages");
    if (
      pkgs &&
      pkgs.length > 0 &&
      (pkgs.get("firstObject.hasAllPackagesDesignated") ||
        pkgs.get("firstObject.hasAllPackagesDispatched"))
    ) {
      transition.abort();
      this.get("messageBox").alert(
        this.get("i18n").t("designated_dispatched_error")
      );
    }
  },

  beforeModel(transition) {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop().name;
    this.set("backLinkPath", previousRoute);
  },

  model(params) {
    const store = this.store;
    const itemId = params["item_id"];
    return store.peekRecord("item", itemId) || store.findRecord("item", itemId);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set("previousRoute", this.get("backLinkPath"));
  }
});
