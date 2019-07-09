const path = require("path");
const express = require("express");
let app = express();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const morgan = require("morgan");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io").listen(server);

const routes = require("./routes.js");
const PORT = process.env.PORT || 8080;
let mongooseConfig = require("./model/mongooseConfig");
const clients = {};

mongooseConfig.init();
app.use(morgan("tiny"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: "rumpelstiltskin",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

require("./config/config-passport");
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);
app.use(express.join(__dirname, "..", "dist"));
mongooseConfig.connect();
server.listen(PORT, () => {
  console.log(`Listen port ${PORT}`);
});

io.on("connection", socket => {
  const id = socket.id;
  const user = {
    username: socket.handshake.headers.username,
    id
  };
  clients[id] = user;
  socket.broadcast.emit("new user", user);
  socket.emit("all users", clients);

  socket.on("chat message", (data, userId) => {
    if (userId !== socket.id) {
      io.sockets.connected[userId].emit("chat message", data, socket.id);
    }
  });

  socket.on("disconnect", () => {
    delete clients[id];
    socket.broadcast.emit("delete user", id);
  });
});
