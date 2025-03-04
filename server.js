const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const {
  createRoom,
  removeUser,
  saveChatMessage,
  getUserChatMessage,
  findRoomByPlayerSocketId,
  notifyGameDisconnection,
  getOpponentSocketId
} = require("./socketHandler");
const authRoute = require("./Routes/auth.Route");
const cors = require("cors");
const { on } = require("events");
const User = require("./Model/user.Model");
const { v4: uuidv4 } = require('uuid');

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
  createRoom(pending_list, rooms, io, socket);

  console.log("pending_list", pending_list);
  console.log("rooms", rooms);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    console.log("after disconnect room chekc ==== >", rooms);
    if (rooms) {
      const group = findRoomByPlayerSocketId(rooms, socket.id);
      let opponentId;
      if (group?.roomDetails?.player1 !== socket.id) {
        opponentId = group?.roomDetails?.player1;
      } else if (group?.roomDetails?.player2 !== socket.id) {
        opponentId = group?.roomDetails?.player2;
      }
      console.log("opponentId ==== >", opponentId);
      notifyGameDisconnection(opponentId, io);
      removeUser(socket, pending_list, rooms);
      console.log("after disconnect group ==== >", rooms);
    }
    removeUser(socket, pending_list, rooms);
  });
  // SOCKET FOR  multiple CHAT 
  socket.on("joinChatRoom", async (data) => {
    console.log("joinChatRoom ==== >", data);

    const { userId } = data;
    if (userId) {
      socket.join(userId);
    }
  });
  socket.on("sendMessage", (data) => {
    // console.log("sendMessage ====>", data.receiver_id, "&", data.sender_id);
    saveChatMessage(data, io, socket);
  });
  socket.on("receiveUserChat", async (data) => {
    console.log("receiveUserChat", data);
    try {
      const chatMessages = await getUserChatMessage(data);
      if (chatMessages) {
        socket.emit("userChatMessages", chatMessages);
        // console.log("receiveUserChat 222",chatMessages);
      } else {
        socket.emit("userChatMessages", {
          error: "No messages found for this user.",
        });
      }
    } catch (error) {
      console.error("Error in receiveUserChat:", error.message);
      socket.emit("userChatMessages", {
        error: "Failed to fetch chat messages.",
      });
    }
  });
  //SOCKET FOR BINGO
  socket.on("sendNumber", async (data) => {
    const group = findRoomByPlayerSocketId(rooms, socket.id);
    console.log("check existing group ===== >", group);
    if (!group) {
      console.error("Group not found for socket ID:", socket.id);
      return;
    }
    io.to(group?.roomDetails?.player1).emit("receiveNumber", data);
    io.to(group?.roomDetails?.player2).emit("receiveNumber", data);

    socket.on("onTurnChanges", async (data) => {
      io.to(group?.roomDetails?.player1).emit("playerTurnChange", data);
      io.to(group?.roomDetails?.player2).emit("playerTurnChange", data);
    });
    socket.on("playerGameStatus", async (data) => {
      const group = findRoomByPlayerSocketId(rooms, socket.id);
      let messageForPlayer1, messageForPlayer2;
      if (group.roomDetails.player1 === data) {
        messageForPlayer1 = "You are the winner!";
        messageForPlayer2 = "Better Luck, next time!";
      } else if (group.roomDetails.player2 === data) {
        messageForPlayer1 = "Better Luck, next time!";
        messageForPlayer2 = "You are the winner!";
      }

      io.to(group.roomDetails.player1).emit("onGameStatus", messageForPlayer1);
      io.to(group.roomDetails.player2).emit("onGameStatus", messageForPlayer2);

      console.log("messageForPlayer1 ==== >", messageForPlayer1);
      console.log("messageForPlayer2 ===== >", messageForPlayer2);
    });
  });
  // CHAT IN BINGO
  socket.on("sendMessage1", async (data) => {
    const group = findRoomByPlayerSocketId(rooms, socket.id);
    const messageId = uuidv4(); 
  
    if (group) {
      const receiver_id = getOpponentSocketId(socket.id, group);
      io.to(receiver_id).emit('receiveMessage', {user: "",message: data.message,msgId: messageId});
      socket.emit('receiveMessage', {user: "You",message: data.message,msgId: messageId,});
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
