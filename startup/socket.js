exports.setupSocket = (http) => {
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
    // transports: ["websocket"]
  });
  const routes = require("../chat");
  routes.setup(socketio);
};