import { alias } from "@ember/object/computed";
import Controller from "@ember/controller";
import config from "../../config/environment";

export default Controller.extend({
  canCancel: alias("model.delivery.gogovanOrder.isCancelled"),
  driverContact: alias("model.delivery.gogovanOrder.driverMobile"),
  gogovanContact: config.APP.GOGOVAN_CONTACT
});
