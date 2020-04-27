const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let timers = [15 * 60, 15 * 60, 15 * 60, 15 * 60, 15 * 60, 10];

setInterval(() => {
  timers = timers.map((timer) => --timer);
}, 1000);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const interval = setInterval(() => {
    io.emit(`interval`, timers);
  }, 1000);

  socket.on("init", (channel) => {
    timers[channel - 1] = 15 * 60;
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
