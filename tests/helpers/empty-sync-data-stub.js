import config from "../../config/environment";
import "../factories/territory";
import "../factories/address";
import "../factories/contact";
import "../factories/schedule";
import "../factories/delivery";
import "../factories/gogovan_order";
import "../factories/offer";
import "../factories/package_type";
import "../factories/package";
import "../factories/donor_condition";
import "../factories/rejection_reason";
import "../factories/permission";
import "../factories/user_profile";
import "../factories/timeslot";
import "../factories/gogovan_transport";
import "../factories/crossroads_transport";
import "../factories/message";
import "../factories/version";

export default function(testHelper) {
  config.APP.PRELOAD_TYPES.concat(config.APP.PRELOAD_AUTHORIZED_TYPES).forEach(
    function(type) {
      testHelper.mockFindAll(type, 0);
    }
  );

  var data = {
    addresses: [
      {
        id: 2,
        street: "Yasmeen Rapid",
        flat: "Suite 590",
        building: "06932",
        district_id: 67,
        addressable_id: 2,
        addressable_type: "User"
      }
    ],
    user_profile: {
      id: 2,
      first_name: "David",
      last_name: "Dara51",
      mobile: "51111111",
      address_id: 2,
      image_id: null,
      permission_id: null
    }
  };

  $.mockjax({ url: "/api/v1/auth/current_user_profil*", responseText: data });

  //hide sync-data related mocks from console, but show test related mocks
  $.mockjaxSettings.logging = false;
  testHelper.lookup("router:main").one("didTransition", function() {
    $.mockjaxSettings.logging = true;
  });
}
