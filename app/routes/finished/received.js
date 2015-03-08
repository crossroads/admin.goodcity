import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({
  renderTemplate: function() {
    this.render('my_list.reviewing', {controller: 'finished.received'});
  },

  model: function() {
    return this.store.filter('offer', function(offer) {
      return offer.get('isReceived');
    });
  }
});
