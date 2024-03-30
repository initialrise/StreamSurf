const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const ffmpegChildProcess = require("./utils/ffmpeg");

ffmpegChildProcess.stdout.on("data", (data) => {
  console.log(`ffmpeg stdout: ${data}`);
});

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

app.get("/", (req, res) => {
  res.render("index.html");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
