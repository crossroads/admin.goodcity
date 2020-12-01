import Ember from "ember";
export default Ember.Component.extend({
  isClicked: false,

  actions: {
    handleClick() {
      this.toggleProperty("isClicked");
    }
  }
});
