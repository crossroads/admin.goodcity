import { alias } from "@ember/object/computed";
import Controller from "@ember/controller";
import scheduledOffersMixin from "./../mixins/scheduled_offers";

export default Controller.extend(scheduledOffersMixin, {
  collectionCount: alias("collection.length"),
  ggvCount: alias("ggv.length"),
  dropOffCount: alias("dropOff.length")
});
