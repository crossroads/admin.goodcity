import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if (this.session.get('isLoggedIn')) {
      var currentUser = this.get('session.currentUser');
      var myOffers = this.store.all('offer').filterBy('reviewedBy.id', currentUser.get('id'));
      if(myOffers.get('length') > 0) {
        this.transitionTo('my_list');
      } else {
        this.transitionTo('offers.submitted');
      }
    } else {
      this.transitionTo('login');
    }
  }
});
