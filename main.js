const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const dotenv = require(dotenv).setup();

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const args = [
  "-i",
  "-",
  "-c:v",
  "libx264",
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-r",
  `${25}`,
  "-g",
  `${25 * 2}`,
  "-keyint_min",
  25,
  "-crf",
  "25",
  "-pix_fmt",
  "yuv420p",
  "-sc_threshold",
  "0",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-ar",
  128000 / 4,
  "-f",
  "flv",
  `rtmp://a.rtmp.youtube.com/live2/${STREAM_KEY}`,
];

const ffmpegChildProcess = spawn("ffmpeg", args);
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
