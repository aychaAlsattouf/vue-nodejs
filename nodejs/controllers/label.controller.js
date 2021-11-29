const Label = require("../models/label.model");


// Retrieve all annotation from the database (with condition).
exports.findAll = (req, res) => {

    Label.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Labels."
          });
        else res.send(data);
      });
};