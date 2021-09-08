import Ember from "ember";

export default Ember.TextField.extend({
  tagName: "input",
  classNames: "pickadate",
  attributeBindings: [
    "name",
    "type",
    "value",
    "id",
    "required",
    "pattern",
    "placeholder"
  ],

  didInsertElement() {
    var _this = this;
    var setting = false;

    Ember.run.scheduleOnce("afterRender", this, function() {
      Ember.$(".pickadate").pickadate({
        format: "dd/mm/yyyy",
        monthsFull: moment.months(),
        monthsShort: moment.monthsShort(),
        weekdaysShort: moment.weekdaysShort(),
        clear: false,
        today: false,
        close: false,
        min: moment().toDate(),

        onClose: function() {
          Ember.$(document.activeElement).blur();
          if (setting) {
            return;
          }
          var date = this.get("select") && this.get("select").obj;

          if (date) {
            _this.set("selection", date);
            setting = true;
            Ember.run.next(() => {
              this.set("select", new Date(date), { format: "dd/mm/yyyy" });
              setting = false;
            });
          }
        },

        onOpen: function() {
          var date = _this.get("selection");
          if (date) {
            date = date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
            this.set("select", new Date(date), { format: "dd/mm/yyyy" });
          }
        }
      });
    });
  }
});
