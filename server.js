const { Server } = require("socket.io");
const port = 3000;
const { createRoom, removeUser } = require("./socketHandler");

const io = new Server(port, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let pending_list = [];
let rooms = {};

io.on("connection", async (socket) => {
  console.log(`A user connected: ${socket.id}`);

  pending_list.push(socket.id);
  createRoom(pending_list, rooms);

  socket.on("disconnect", () => removeUser(socket, pending_list, rooms));
  socket.on("onleave", () => removeUser(socket, pending_list, rooms));
});

console.log("socket server is runnig on", port);

// createRoom(pending_list, rooms);
// socketDisconnect(pending_list, rooms);
