const sql = require("../db.js");

// constructor
const Label = function(label) {
  this.label = label.name;
};



Label.getAll = ( result) => {
  let query = "SELECT * FROM labels";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Annotation: ", res);
    result(null, res);
  });
};



module.exports = Label;