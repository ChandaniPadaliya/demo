const express = require("express");

// start express server
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.setHeader("Acces-Control-Allow-Origin", "*");
  res.setHeader("Acces-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Acces-Contorl-Allow-Methods", "Content-Type", "Authorization");
  next();
});


const http = require("http").createServer(app);
// colling startup files
require("./startup/config")();
require("./startup/dbConfig")();
require("./startup/user.routes")(app);

// Setup server port
const port = process.env.PORT || 10000;

// listen for requests
http.listen(port, () => console.log(`INFO: ON PORT TO ${port}`));

const socketio = require("socket.io")(http, {
  cors: {
    origins: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  secure: true,
  reconnection: true,
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
  pingInterval: 25000,
});
  
function setupsoket() {
  const routes = require("./chat");
  routes.setup(socketio);
}

setupsoket();