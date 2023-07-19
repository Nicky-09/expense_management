const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    email: String,
    username: String,
    password: String,
  },
  { timestamps: true }
);

module.exports.Users = mongoose.model("Users", User);
