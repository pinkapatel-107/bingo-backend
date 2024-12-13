

  // socket.on("joinRoom", () => {
  //   try {
  //     console.log("Client added to pending list:", socket.id);
  //     let message;
  //     if (pending_list.length >= 2) {
  //       createRoom(pending_list, rooms, io);
  //       message = "Room joined successfully!";
  //     } else {
  //       console.log("Waiting for another player to join...");
  //       message = "Waiting for another player to join...";
  //     }
  //     socket.emit("roomJointed", { message });
  //   } catch (error) {
  //     console.error("Error in joinRoom:", error);
  //   }
  // });