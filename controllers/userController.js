const User = require("../models/userModel");
const signup = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const rtmp_key = req.body.rtmp_key;

  try {
    const newUser = await User.create({ username, password, rtmp_key });
    res.json({ status: "success", newUser });
  } catch (err) {
    res.json({ status: "failed", err });
  }
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.find({ username, password }).select("-__v");
    res.json({ status: "success", user });
  } catch (err) {
    res.json({ status: "failed", err });
  }
};

module.exports = { signup, login };
