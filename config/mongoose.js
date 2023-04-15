const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/project");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error - Conecting to mongodb"));

db.once("open", () => {
  console.log("Success - Connected to Database - Mongodb");
});
