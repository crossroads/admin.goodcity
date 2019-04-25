import $ from "jquery";
import { observer } from "@ember/object";
import TextArea from "@ember/component/text-area";

export default TextArea.extend({
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

  valueChanged: observer("value", function() {
    this.setTextareaHeight();
  }),

  didInsertElement() {
    this.setTextareaHeight();
  },

  setTextareaHeight: function() {
    var textarea = this.element;
    var offset = textarea.offsetHeight - textarea.clientHeight;

    $(textarea)
      .css("height", "auto")
      .css("height", offset)
      .removeAttr("data-autoresize");
  }
});
