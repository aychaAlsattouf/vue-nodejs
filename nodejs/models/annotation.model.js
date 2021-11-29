const sql = require("../db.js");

// constructor
const Annotation = function(annotation) {
  this.top = annotation.top;
  this.left = annotation.left;
  this.width = annotation.width;
  this.height = annotation.height;
  this.label_id = annotation.label_id;
};

Annotation.create = (newAnnotation, result) => {
  sql.query("INSERT INTO annotations SET ?", newAnnotation, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created Annotation: ", { id: res.id, ...newAnnotation });
    result(null, { id: res.id, ...newAnnotation });
  });
};

Annotation.findById = (id, result) => {
  sql.query(`SELECT * FROM annotations WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found annotation: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Annotation.getAll = ( result) => {
  let query = "SELECT * FROM annotations";

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

Annotation.remove = (id, result) => {
  sql.query("DELETE FROM annotations WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted annotation with id: ", id);
    result(null, res);
  });
};

Annotation.removeAll = result => {
  sql.query("DELETE FROM annotations", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} annotations`);
    result(null, res);
  });
};

module.exports = Annotation;