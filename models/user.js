const mongoose = require("mongoose");

/* Create Schema */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      required: true,
    },
    hashed_password: {
      type: "String",
      required: true,
    },
  },
  {
    timeStamp: true,
  }
);

const User = mongoose.model("project", userSchema);

module.exports = User;
