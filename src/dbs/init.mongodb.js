"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const { db } = require("../configs/config.mongodb");

const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;
console.log(connectString);

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(() => {
        countConnect();
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.log(err);
        console.log("Error to MongoDB");
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
