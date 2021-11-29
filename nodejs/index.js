const express = require('express');
const cors = require("cors");
const mysqlConnection = require('./db.js');
const annotationRouters = require('./routers/annotation.routers');
const labelRouters = require('./routers/label.router.js')
app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/annotation",annotationRouters);
app.use("/label",labelRouters);

// simple route
app.get("/", (req,res) => {
  res.json({message: "Hello From annotation api"})
});


// set port, listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log('server started on port ',PORT);


});

