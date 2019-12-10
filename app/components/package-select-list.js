import $ from "jquery";
import SelectList from "./select-list";

export default SelectList.extend({
  layoutName: "components/select-list",
  content: null,
  selectedValue: null,
  pkg: null,
  index: null,
  didUpdatedOnce: false,

  didRender() {
    this._super(...arguments);
    if (
      !this.get("didUpdatedOnce") &&
      this.get("pkg") !== null &&
      this.get("pkg.item.packageType") !== null
    ) {
      const packageType =
        this.get("pkg.packageType") || this.get("pkg.item.packageType");
      if (this.isPackageTypeChanged(packageType)) {
        this.set("pkg.notes", packageType.get("name"));
      }
      this.set("pkg.packageType", packageType);
      $("textarea#" + this.get("index")).val(this.get("pkg.notes"));
      this.set("didUpdatedOnce", false);
    }
  },

  isPackageTypeChanged(packageType) {
    return (
      this.get("pkg.notes") === packageType.get("name") ||
      this.get("pkg.notes").trim().length === 0 ||
      this.get("pkg.packageType.name") !== packageType.get("name")
    );
  },

  didUpdate() {
    this._super(...arguments);
    this.set("pkg.packageType", this.get("pkg.packageType"));
    this.set("didUpdatedOnce", true);
  },

  actions: {
    change() {
      const changeAction = this.get("on-change");
      const selectedIndex = this.$("select").prop("selectedIndex");
      var content = this.get("content").toArray();
      if (this.get("prompt")) {
        content = [{ name: null }].concat(content);
      }
      const selectedValue = content[selectedIndex];
      if (this.index !== null && selectedValue.name !== null) {
        selectedValue.set("indexOfChild", this.get("index"));
        var availablePkg = this.get("pkg");
        var name = selectedValue.get("name");
        $("textarea#" + this.get("index")).val(name);
        selectedValue.set("indexOfChild", availablePkg.id);
      }
      this.set("selectedValue", selectedValue);
      changeAction(selectedValue);
    }
  }
});
