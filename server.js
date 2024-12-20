const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const { createRoom, removeUser,saveChatMessage,getUserChatMessage,findRoomByPlayerId } = require("./socketHandler");
const authRoute = require("./Routes/auth.Route");
const cors = require("cors");
const { on } = require("events");

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
  createRoom(pending_list, rooms, io,socket);

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
    // console.log("sendMessage ====>", data.receiver_id, "&", data.sender_id);
    saveChatMessage(data,io,socket)
  });
  socket.on('receiveUserChat', async (data) => {
    console.log("receiveUserChat",data);
    try {
      const chatMessages = await getUserChatMessage(data);
      if (chatMessages) {
        socket.emit('userChatMessages', chatMessages);
        // console.log("receiveUserChat 222",chatMessages);
      } else {
        socket.emit('userChatMessages', { error: "No messages found for this user." });
      }
    } catch (error) {
      console.error("Error in receiveUserChat:", error.message);
      socket.emit('userChatMessages', { error: "Failed to fetch chat messages." });
    }
  });
   //SOCKET FOR BINGO 
   socket.on('sendNumber', async (data) => {
    console.log("Available rooms:", rooms);
    console.log("Socket ID sending the number:", socket.id);
  
    const group = findRoomByPlayerId(socket.id);
    console.log("group ==== >",group)
    if (!group) {
      console.error("Group not found for socket ID:", socket.id);
      return;
    }
  
    const { roomName, players } = group;
    const receiverId = socket.id === players.player1 ? players.player2 : players.player1;
  
    io.to(receiverId).emit('receiveNumber', data);
    console.log(`Number sent to ${receiverId} from ${socket.id} in room ${roomName}`);
  });
  
  
});
// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
