const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { signup, login, protect } = require("./controllers/userController");
const cookieParser = require("cookie-parser");
const pug = require("pug");
const User = require("./models/userModel");
require("dotenv").config();

const app = express();
app.use(express.urlencoded());
app.use(cookieParser());
app.set("view engine", "pug");

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("Connection Successful");
});
const server = http.createServer(app);

const io = new Server(server);

const ffmpeg = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, dec) => {
      if (err) {
        throw new Error("Wrong token");
      } else {
        decoded = dec;
      }
    });
  } catch (err) {
    console.log(err);
  }
  const user = await User.findById(decoded);
  const rtmp_key = user.rtmp_key;
  console.log(rtmp_key);
  const createChildProcess = require("./utils/ffmpeg");
  const ffmpegChildProcess = createChildProcess(rtmp_key);
  ffmpegChildProcess.stderr.on("data", (data) => {
    console.error(`ffmpeg stderr: ${data}`);
  });

  io.on("connection", (socket) => {
    console.log("connection from client", socket.id);
    socket.on("video-data", (data) => {
      ffmpegChildProcess.stdin.write(data, (e) => {});
    });
  });
  next();
};
app.use(express.static(`${__dirname}/public`));
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.post("/signup", signup);
app.post("/login", login);

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/stream", protect, ffmpeg, (req, res) => {
  res.render("stream");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
