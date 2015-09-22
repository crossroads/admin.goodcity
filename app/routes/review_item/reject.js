import AuthorizeRoute from './../authorize';

export default AuthorizeRoute.extend({

  model: function() {
    var itemId = this.modelFor('review_item').get('id');
    return this.store.peekRecord('item', itemId);
  }
});
