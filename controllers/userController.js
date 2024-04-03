const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const rtmp_key = req.body.rtmp_key;

  try {
    const newUser = await User.create({ username, password, rtmp_key });
    // res.json({ status: "success", newUser });
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
        // res.json({ status: "success", token });
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
  const authorization = req.headers.authorization;
  try {
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1].trim();
      let decoded;
      jwt.verify(token, process.env.JWT_SECRET, (err, dec) => {
        if (err) {
          throw new Error("Wrong token");
        } else {
          decoded = dec;
        }
      });
      console.log(decoded);
      next();
    }
  } catch (err) {
    res
      .status(401)
      .json({ status: "failed", message: "Token invalid or unavailable" });
  }
};

module.exports = { signup, login, protect };
