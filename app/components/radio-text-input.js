import $ from "jquery";
import TextField from "@ember/component/text-field";

export default TextField.extend({
  tagName: "input",
  type: "text",
  attributeBindings: ["name", "id", "value", "disabled", "placeholder"],
  disabled: false,

  click() {
    $(this.element)
      .closest("li")
      .find("input[type='radio']")
      .prop("checked", true);
  }
});
