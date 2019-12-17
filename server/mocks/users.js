module.exports = function(app) {
  var express = require("express");
  var usersRouter = express.Router();

  var users_json = {
    addresses: [
      {
        id: 1,
        street: null,
        flat: null,
        building: null,
        district_id: null,
        addressable_type: "User",
        addressable_id: 1
      }
    ],
    districts: [],
    permissions: [
      {
        id: 1,
        name: "Reviewer"
      }
    ],
    user: {
      id: 1,
      first_name: "Tom",
      last_name: "Jones",
      mobile: "12345678",
      printer: {
        id: "1",
        name: "GoodcityInkJet"
      },
      permission_id: null
    }
  };

  usersRouter.get("/:id", function(req, res) {
    if (req.params.id == 2) {
      users_json.user.id = 2;
      users_json.user.permission_id = 1;
    } else {
      users_json.user.id = 1;
      users_json.user.permission_id = null;
    }
    res.send(users_json);
  });

  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/users/:id", usersRouter);
};
