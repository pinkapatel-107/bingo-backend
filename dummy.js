const io = require("socket.io")(3000);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
    io.to(room).emit("message", `${socket.id} has joined the room`);
  });

  socket.on("leaveRoom", ({ room }) => {
    socket.leave(room);
    console.log(`${socket.id} left room: ${room}`);
    io.to(room).emit("message", `${socket.id} has left the room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
