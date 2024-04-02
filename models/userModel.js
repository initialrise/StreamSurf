const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: String,
    required: true,
  },
  {
    password: String,
    required: true,
  },
  {
    rmtp_key: String,
    required: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
