const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { signup, login, protect } = require("./controllers/userController");
const cookieParser = require("cookie-parser");
const pug = require("pug");
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
const ffmpegChildProcess = require("./utils/ffmpeg");

// ffmpegChildProcess.stdout.on("data", (data) => {
//   console.log(`ffmpeg stdout: ${data}`);
// });

ffmpegChildProcess.stderr.on("data", (data) => {
  //for debuging errors returned as stderr by ffmpeg
  console.error(`ffmpeg stderr: ${data}`);
});

io.on("connection", (socket) => {
  console.log("connection from client", socket.id);
  socket.on("video-data", (data) => {
    ffmpegChildProcess.stdin.write(data, (e) => {
      //   console.log(e);
    });
  });
});

app.use(express.static(`${__dirname}/public`));

app.post("/signup", signup);
app.post("/login", login);

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/stream", protect, (req, res) => {
  res.render("stream");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
