const { json } = require("body-parser");
const chatModel = require("./Model/chat.model");

let groups = [];
let message;

const createRoom = async (pendingList, rooms, io, socket) => {
  if (pendingList.length >= 2) {
    const newGroups = makePairs(pendingList);
    groups = [...groups, ...newGroups];

    newGroups.forEach((group, index) => {
      const roomId = `room_${groups.length + index}`;
      rooms[roomId] = group;

      assignPlayersToRoom(group, io, socket);
    });
  } else {
    console.log("Waiting for another player to join...");
  }
};

const removeUser = async (socket, pending_list, rooms) => {
  console.log("User disconnected: ", socket?.id);

  const index = pending_list?.indexOf(socket?.id);
  if (index > -1) {
    pending_list?.splice(index, 1);
  }

  for (const room in rooms) {
    for (const player in rooms[room]) {
      if (rooms[room][player] === socket.id) {
        delete rooms[room][player];
      }
    }
    if (Object.keys(rooms[room]).length === 1) {
      delete rooms[room];
    }
  }
  // io.emit("userLeavedRoom",true) // player after leave the from the room here need to delete those room as well need to send same flag to send client side
  console.log("Updated pending_list: ", pending_list);
  console.log("Updated rooms: ", rooms);
};

const saveChatMessage = async (data, io, socket) => {
  console.log("testing chat save chat fun");

  // const newMessage = {
  //   sender_id: "675ac2b827af2c18b5efdf85",
  //   receiver_id: "675ac29927af2c18b5efdf82",
  //   message: "hello how are you?",
  // };

  let chat = await chatModel.create(data);
  let getchat = await chatModel.findById(chat._id);
  // .populate({ path: "sender_id" })
  // .populate({ path: "receiver_id" });

  console.log("chat data === >", getchat);
  io.to(data.sender_id).emit("receiveMessage", getchat);
  io.to(data.receiver_id).emit("receiveMessage", getchat);
};

const getUserChatMessage = async (data) => {
  try {
    const chatMessages = await chatModel.find({
      $or: [
        { sender_id: data.currentUserId, receiver_id: data.selectedUserId },
        { sender_id: data.selectedUserId, receiver_id: data.currentUserId },
      ],
    });
    return chatMessages;
  } catch (error) {
    console.error("Error fetching chat messages:", error.message);
    return null;
  }
};

function createGroup(player1, player2) {
  const group = { player1, player2 };
  groups.push(group);
  return group;
}

function makePairs(list) {
  const pairs = [];
  while (list.length >= 2) {
    pairs.push(createGroup(list.shift(), list.shift()));
  }
  return pairs;
}
function assignPlayersToRoom(group, io, socket) {
  [group.player1, group.player2].forEach((player, index) => {
    io.to(player).emit("roomJointed", {
      player: index === 0 ? "first player" : "second player",
      message: "Successfully joined room",
    });
    // socket.on('sendNumber',async(data)=>{
    //   io.to(player).emit('receiveNumber',data);
    //   console.log("sendNumber === >",data)
    // });
  });
}

const findRoomByPlayerSocketId = (rooms, playerId) => {
  for (const [room, players] of Object.entries(rooms)) {
    if (players.player1 === playerId || players.player2 === playerId) {
      return { roomName: room, roomDetails: players };
    }
  }
  return null;
};

module.exports = {
  createRoom,
  removeUser,
  saveChatMessage,
  getUserChatMessage,
  findRoomByPlayerSocketId,
};
