module.exports = function(app) {
  let express = require("express");
  let offersRouter = express.Router();
  let image_id = "1407764294/default/test_image.jpg";

  let emoty_search = {
    offers: [],
    items: [],
    images: [],
    donor_conditions: [],
    addresses: [],
    user: [],
    permissions: []
  };

  let offers_json = {
    offers: [
      {
        id: "1",
        state: "draft",
        item_ids: ["1", "2"],
        delivery_id: null,
        created_by_id: "1"
      },
      { id: "2", state: "draft", delivery_id: null, created_by_id: "1" },
      {
        id: "3",
        language: "en",
        state: "submitted",
        created_by_id: "1",
        item_ids: ["4"],
        delivery_id: null
      },
      {
        id: "4",
        language: "en",
        state: "under_review",
        created_by_id: "1",
        item_ids: ["5"],
        delivery_id: null,
        reviewed_by_id: "2"
      }
    ],
    items: [
      {
        id: "1",
        donor_description: "example1",
        offer_id: "1",
        image_ids: ["1", "2"]
      },
      { id: "2", donor_description: "example2", offer_id: "1" },
      {
        id: "4",
        donor_description: "Velit fugit amet quos ut minima quis",
        offer_id: "3",
        donor_condition_id: "1",
        image_ids: ["1"],
        state: "submitted"
      },
      {
        id: "5",
        donor_description: "test",
        offer_id: "4",
        donor_condition_id: "1",
        image_ids: ["1"],
        state: "accepted"
      }
    ],
    images: [
      { id: "1", favourite: "false", cloudinary_id: image_id },
      { id: "2", favourite: "true", cloudinary_id: image_id }
    ],
    donor_conditions: [
      { id: 1, name: "New" },
      { id: 4, name: "Broken" },
      { id: 2, name: "Lightly Used" },
      { id: 3, name: "Heavily Used" }
    ],
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
    messages: [
      {
        id: "1",
        body: "I have made an offer.",
        state: null,
        sender_id: "1",
        is_private: false,
        offer_id: "4",
        item_id: null
      }
    ],
    user: [
      {
        id: "1",
        first_name: "Kendrick",
        last_name: "Kiehn",
        permission_id: null,
        mobile: "+85251111111"
      },
      {
        id: "2",
        first_name: "Jaleel",
        last_name: "Ondricka",
        permission_id: "2",
        mobile: "12345678"
      }
    ],
    permissions: [
      { id: "2", name: "Supervisor" },
      { id: "1", name: "Reviewer" }
    ]
  };

  let offer_json = {
    offer: {
      id: "3",
      language: "en",
      state: "submitted",
      created_by_id: "1",
      item_ids: ["4"],
      delivery_id: null
    },

    items: [
      {
        id: "4",
        donor_description: "Velit fugit amet quos ut minima quis",
        offer_id: "3",
        donor_condition_id: "1",
        image_ids: ["1"],
        state: "submitted"
      }
    ],
    images: [{ id: "1", favourite: "false", cloudinary_id: image_id }],
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
    messages: [
      {
        id: "1",
        body: "I have made an offer.",
        state: null,
        sender_id: "1",
        is_private: false,
        offer_id: "4",
        item_id: null
      }
    ],
    user: [
      {
        id: "1",
        first_name: "Kendrick",
        last_name: "Kiehn",
        permission_id: null,
        mobile: "+85251111111"
      },
      {
        id: "2",
        first_name: "Jaleel",
        last_name: "Ondricka",
        permission_id: "2",
        mobile: "12345678"
      }
    ],
    permissions: [
      { id: "2", name: "Supervisor" },
      { id: "1", name: "Reviewer" }
    ]
  };

  let finishedOffers = {
    offers: [
      { id: "5", state: "closed" },
      { id: "6", state: "received", created_by_id: "4" }
    ],
    user: [
      {
        id: "2",
        first_name: "Jaleel",
        last_name: "Ondricka",
        permission_id: "2",
        mobile: "12345678"
      },
      {
        id: "4",
        first_name: "Jaleel",
        last_name: "Ondricka",
        permission_id: null,
        mobile: "12345678"
      }
    ],
    items: [
      { id: "1", offer_id: "5", state: "rejected" },
      { id: "2", offer_id: "6", state: "accepted" }
    ]
  };

  let closedOffers = {
    offers: [{ id: "5", state: "closed", reviewed_by_id: "2" }],
    user: [
      {
        id: "2",
        first_name: "Jaleel",
        last_name: "Ondricka",
        permission_id: "2",
        mobile: "12345678"
      }
    ],
    items: [{ id: "1", offer_id: "5", state: "rejected" }]
  };

  let receivedOffers = {
    offers: [{ id: "5", state: "received", created_by_id: "3" }],
    user: [
      {
        id: "3",
        first_name: "Jaleel",
        last_name: "Ondricka",
        permission_id: null,
        mobile: "12345678"
      }
    ],
    items: [{ id: "1", offer_id: "5", state: "accepted" }]
  };

  offersRouter.get("/", function(req, res) {
    let offers = offers_json;
    if (req.query.states) {
      if (req.query.states.indexOf("not_active") >= 0) offers = finishedOffers;
      else if (req.query.states.indexOf("cancelled") >= 0)
        offers = closedOffers;
      else if (req.query.states.indexOf("received") >= 0)
        offers = receivedOffers;
    }
    res.send(offers);
  });

  offersRouter.get("/invalid", function(req, res) {
    res.statusCode = 404;
    res.send({});
  });

  offersRouter.get("/search", function(req, res) {
    let searchText = req.query["searchText"];
    if (JSON.stringify(offers_json).indexOf(searchText) >= 0) {
      return res.send(offers_json);
    }
    return res.send(emoty_search);
  });

  offersRouter.get("/:id", function(req, res) {
    res.send(offer_json);
  });

  offersRouter.delete("/:id", function(req, res) {
    res.send({});
  });

  offersRouter.put("/:id", function(req, res) {
    res.send(offer_json);
  });

  offersRouter.post("/", function(req, res) {
    res.send({
      offers: [{ id: "3", state: "draft" }]
    });
  });

  app.use("/api/v1/offers", offersRouter);
  app.use("/api/v1/offers/:id", offersRouter);
};
