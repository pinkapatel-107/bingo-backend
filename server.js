const { Server } = require("socket.io");
const port = 3000;
const { createRoom, socketDisconnect } = require("./socketHandler");

const io = new Server(port, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let pending_list = [
  "pinka-123",
  "shivangi-5252",
  "rohan-5252",
  "test-795",
  "pinka-123",
  "shivangi-5252",
  "pinka-123",
  "shivangi-5252",
];
let rooms = {};

io.on("connection", async (socket) => {
  console.log(`A user connected: ${socket.id}`);

  pending_list.push(socket.id);
  createRoom(pending_list, rooms);

  socket.on("disconnect", () =>
    handleDisconnection(socket, pending_list, rooms)
  );
});

console.log("socket server is runnig on", port);

// createRoom(pending_list, rooms);
// socketDisconnect(pending_list, rooms);
