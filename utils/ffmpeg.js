const { spawn } = require("child_process");
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
];

const createChildProcess = (rtmp_key) => {
  const rmtp_url = `rtmp://a.rtmp.youtube.com/live2/${rtmp_key}`,
    new_args = [...args, rmtp_url];
  console.log(new_args);
  return spawn("ffmpeg", new_args);
};
// module.exports = ffmpegChildProcess = spawn("ffmpeg", args);
module.exports = createChildProcess;
