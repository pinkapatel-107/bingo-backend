const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const { createRoom, removeUser,saveChatMessage } = require("./socketHandler");
const authRoute = require("./Routes/auth.Route");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("./DBinit");
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

  console.log("pending_list", pending_list);
  console.log("rooms", rooms);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket, pending_list, rooms);
  });
  // SOCKET FOR CHAT
  socket.on("joinChatRoom", async (data) => {
    console.log("joinChatRoom ==== >", data);

    const { userId } = data;
    if (userId) {
      socket.join(userId);
    }
  });
  socket.on("sendMessage", (data) => {
    console.log("sendMessage ====>", data.receiver_id, "&", data.sender_id);
    saveChatMessage(data,io,socket)
    // io.to(data.receiver_id || data.sender_id).emit("receiveMessage", data);
    // console.log("Message received sent successfully ===>", data);
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
