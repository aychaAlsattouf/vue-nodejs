const labels = require("../controllers/label.controller");

var router = require("express").Router();

// Retrieve all labels
router.get("/", labels.findAll);


module.exports = router;