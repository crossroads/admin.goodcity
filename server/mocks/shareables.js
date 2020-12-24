module.exports = function(app) {
  app.use("/api/v2/shareables", (req, res) => {
    res.json({
      data: []
    });
  });
};
