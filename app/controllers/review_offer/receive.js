import Ember from "ember";
import AsyncTasksMixin from "../../mixins/async_tasks";

export default Ember.Controller.extend(AsyncTasksMixin, {
  queryParams: ["state"],
  state: "expecting",
  items: Ember.computed.filterBy("model.items", "state", "accepted"),

  actions: {
    addItem() {
      const offer = this.get("model");
      const defaultDonorCondition = this.get("store")
        .peekAll("donorCondition")
        .sortBy("id")
        .get("firstObject");
      let item = this.get("store").createRecord("item", {
        offer: offer,
        donorCondition: defaultDonorCondition,
        state: "accepted"
      });
      this.runTask(
        item.save().then(item => {
          this.transitionToRoute("search_label", item.id, {
            queryParams: { isUnplannedPackage: true }
          });
        })
      );
    }
  }
});
