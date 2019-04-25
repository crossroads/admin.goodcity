import $ from "jquery";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import TextField from "@ember/component/text-field";

export default TextField.extend({
  tagName: "input",
  type: "text",
  attributeBindings: ["name", "id", "value", "placeholder"],
  cordova: service(),

  iosItemTypeSearchPage: computed(function() {
    return (
      this.get("cordova").isIOS() && $(".fixed_item_type_search").length > 0
    );
  }),

  scrollToStart() {
    $(".fixed_item_type_search").css({ position: "absolute" });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  },

  focusOut() {
    if (this.get("iosItemTypeSearchPage")) {
      $(".fixed_item_type_search").css({ position: "fixed" });
    }
  },

  didInsertElement() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.$().focus();
    if (this.get("iosItemTypeSearchPage")) {
      this.element.addEventListener("touchstart", this.scrollToStart);
    }
  },

  willDestroyElement() {
    if (this.get("iosItemTypeSearchPage")) {
      this.element.addEventListener("touchstart", this.scrollToStart);
    }
  }
});
