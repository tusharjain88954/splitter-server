const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
require("./models/db");
require("./config/passportConfig");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const rtsIndex = require("./routes/index.router");
const app = express();

const PORT = process.env.PORT || 8080;
// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use("/", rtsIndex);
// error handler
app.use((err, req, res, next) => {
  // handling nicely mongodb validation errors
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  }
});

// start server
app.listen(PORT, () =>
  console.log(`Server started at port : ${process.env.PORT}`)
);
