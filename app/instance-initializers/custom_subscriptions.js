import _ from "lodash";

export default {
  name: "custom_subscriptions",

  initialize: function(application) {
    const store = application.lookup("service:store");
    const subscriptions = application.lookup("controller:subscriptions");

    subscriptions.addHandler("shareable", ({ item, operation }) => {
      if (operation === "delete") {
        const id = _.get(item, "data.id");
        const record = id && store.peekRecord("shareable", id);

        if (record) {
          store.unloadRecord(record);
        }
      } else {
        store.pushPayload("shareable", item);
      }
    });
  }
};
