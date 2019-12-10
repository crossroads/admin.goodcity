module.exports = function(app) {
  var express = require("express");
  var printerRouter = express.Router();

  var printer_json = {
    printers: [{ id: 1, name: "GoodcityINKJET" }, { id: 2, name: "LaserJET" }]
  };

  printerRouter.get("/", function(req, res) {
    res.send(printer_json);
  });

  app.use("/api/v1/printers", printerRouter);
};
