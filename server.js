const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const { createRoom, removeUser } = require("./socketHandler");
const authRoute = require("./Routes/auth.Route");
const cors = require('cors')

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./DBinit');
// Routes
app.use("/api/v1/auth", authRoute);

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
let pending_list = [];
let rooms = {};

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  pending_list.push(socket.id);
  createRoom(pending_list, rooms, io);

  console.log("pending_list",pending_list);
  console.log("rooms",rooms);


  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket, pending_list, rooms);
  });

  socket.on("sendMessage", (data) => {
    console.log("sendMessage ====>", data);

    if (data.sender_id && data.receiver_id) {
      io.to(data.receiver_id).emit("receiveMessage", data);
      console.log("Message received and sent successfully ===>", data);
    } else {
      console.error("Invalid data: sender_id or receiver_id is missing");
    }
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
