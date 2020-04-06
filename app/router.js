import config from "./config/environment";
import GoodcityRouter from "shared-goodcity/router/router";
import googlePageview from "./mixins/google-pageview";

const Router = GoodcityRouter.extend(googlePageview, {
  location: config.locationType
});

Router.map(function() {
  this.route("offer", { path: "/offers/:offer_id" }, function() {
    this.route("messages");
    this.route("donor_messages");
    this.route("supervisor_messages");
    this.route("merge");
    this.route("search_companies");
    this.route("search_users");
    this.route("search_label");

    this.route("plan_delivery");
    this.route("collection_charges");
    this.route("gogovan_charges");
    this.route("cancel_gogovan");

    this.route("companies", { resetNamespace: true }, function() {
      this.route("new");
    });

    this.route(
      "companies",
      { resetNamespace: true, path: "/companies/:company_id" },
      function() {
        this.route("edit");
      }
    );

    this.route("donors", { resetNamespace: true }, function() {
      this.route("new");
    });

    this.route(
      "item",
      { resetNamespace: true, path: "/items/:item_id" },
      function() {
        this.route("edit_images");
      }
    );

    this.route(
      "package",
      { resetNamespace: true, path: "/package/:package_id" },
      function() {
        this.route("image_editor");
      }
    );

    this.route("review_offer", { resetNamespace: true }, function() {
      this.route("items");
      this.route("logistics");
      this.route("donor_details");
      this.route("receive");
    });

    this.route("receive_package", {
      path: "/receive_package/:package_id",
      resetNamespace: true
    });

    this.route(
      "review_item",
      { resetNamespace: true, path: "/review_item/:item_id" },
      function() {
        this.route("index", { path: "/" });
        this.route("reject");
        this.route("accept");
        this.route("donor_messages");
        this.route("supervisor_messages");
      }
    );

    this.route("search_label", {
      resetNamespace: true,
      path: "/item/:item_id/search_label"
    });

    this.route(
      "delivery",
      { resetNamespace: true, path: "/delivery/:delivery_id" },
      function() {
        this.route("book_timeslot");
        this.route("available_time_slots");
        this.route("contact_details");
        this.route("thank_offer");

        this.route("book_van");
        this.route("confirm_van");
        this.route("porterage_charges");

        this.route("drop_off_schedule");

        this.route("cancel_booking");
      }
    );
  });

  this.route("item_types");
  this.route("packages");
  this.route("my_notifications");
  this.route("search");
  this.route("offers_filters");
  this.route("dashboard", function() {
    this.route("my_offers");
  });

  this.route("users");
  this.route("user", { path: "/users/:user_id" });
  this.route("holidays");
});

export default Router;
