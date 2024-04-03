const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rtmp_key: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
    console.log(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
