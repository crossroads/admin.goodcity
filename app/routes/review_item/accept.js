import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  afterModel(model, transition){

    var pkg = model.get("packages.firstObject");
    var cannotSave = pkg.get("hasAllPackagesDesignated") || pkg.get("hasAllPackagesDispatched");

    if(cannotSave){
      transition.abort()
      this.get('messageBox').alert(this.get("i18n").t('must_login'), () => {
        let my_offer = pkg.get("offerId");
        this.transitionTo('review_offer.items');
      });
      return false;
    }
  },


  setupController(controller, model) {

    this._super(controller, model);
    controller.notifyPropertyChange("itemTypeId");
  }

});
