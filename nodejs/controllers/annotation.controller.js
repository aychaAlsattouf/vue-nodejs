const Annotation = require("../models/annotation.model");

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    // Create a annotation

    const annotation = new Annotation({
        top : req.body.top,
        left : req.body.left,
        width : req.body.width,
        height : req.body.height,
        label_id : req.body.label_id,
      });

    // Save Tutorial in the database
    Annotation.create(annotation, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Annotation."
        });
        else res.send(data);
    });
    
};

// Retrieve all annotation from the database (with condition).
exports.findAll = (req, res) => {
    Annotation.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Annotations."
          });
        else res.send(data);
      });
};
// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    Annotation.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found annotation with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving annotation with id " + req.params.id
            });
          }
        } else res.send(data);
      });
  
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
    Annotation.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Annotations."
          });
        else res.send({ message: `All Annotations were deleted successfully!` });
      });
};