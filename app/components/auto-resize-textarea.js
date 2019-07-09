import Ember from "ember";

export default Ember.TextArea.extend({
  tagName: "textarea",

  attributeBindings: [
    "data-autoresize",
    "value",
    "name",
    "id",
    "placeholder",
    "maxlength",
    "required",
    "pattern"
  ],

  valueChanged: Ember.observer("value", function() {
    this.setTextareaHeight();
  }),

  didInsertElement() {
    this.setTextareaHeight();
  },

  setTextareaHeight: function() {
    if (!this.get("dataAutoresize")) {
      return;
    }

    var textarea = this.element;
    var offset = textarea.offsetHeight - textarea.clientHeight;

    Ember.$(textarea)
      .css("height", "auto")
      .css("height", offset)
      .removeAttr("data-autoresize");
  },

  callAction(action, data = null) {
    if (typeof action === "function") {
      return action(data);
    } else if (typeof action === "string") {
      this.sendAction(action, data);
    }
  },

  input() {
    this.callAction(this.get("changeAction"));
  },

  click() {
    this.callAction(this.get("clickAction"));
  },

  focusOut() {
    this.callAction(this.get("focusOutAction"));
  }
});
