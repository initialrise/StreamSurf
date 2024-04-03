const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const rtmp_key = req.body.rtmp_key;

  try {
    const newUser = await User.create({ username, password, rtmp_key });
    res.render("login", { message: "User created successfully, please login" });
  } catch (err) {
    console.log(err);
    res.json({ status: "failed", err });
  }
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);

  try {
    const user = await User.findOne({ username });
    if (user) {
      const hash = user.password;
      const result = await bcrypt.compare(password, hash);
      if (result) {
        const token = jwt.sign(user.id, process.env.JWT_SECRET);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.redirect("/stream");
      }
    } else {
      res.render("login", { message: "Credentials not matched" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: "failed", err });
  }
};

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, dec) => {
      if (err) {
        throw new Error("Wrong token");
      } else {
        decoded = dec;
      }
    });
    next();
  } catch (err) {
    console.log(err);
    res.redirect("/login", { message: "Please login to access this page" });
  }
};

module.exports = { signup, login, protect };
