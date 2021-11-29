
const annotations = require("../controllers/annotation.controller");

var router = require("express").Router();

// Create a new annotation
router.post("/", annotations.create);

// Retrieve all annotations
router.get("/", annotations.findAll);

// Retrieve a single annotation with id
router.get("/:id", annotations.findOne);

// Delete all annotations
router.delete("/", annotations.deleteAll);
  
module.exports = router;
  