const express = require("express");
const dotenv = require("dotenv");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

dotenv.config();
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");

// init routes
app.get("/", (req, res) => {
  const strCompressed = "Hello world";
  res.status(200).json(strCompressed);
});

// handle errors

module.exports = app;
