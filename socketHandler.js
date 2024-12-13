let groups = [];
let message;
const createRoom = async (pendingList, rooms, io) => {
  if (pendingList.length >= 2) {
    const newGroups = makePairs(pendingList);
    groups = [...groups, ...newGroups];

    newGroups.forEach((group, index) => {
      const roomId = `room_${groups.length+index}`;
      rooms[roomId] = group;

      assignPlayersToRoom(group,io);
    });
  } 
  else {
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

function assignPlayersToRoom(group,io) {
  [group.player1, group.player2].forEach((player, index) => {
    io.to(player).emit("roomJointed",{message:"successfully join room"});
    console.log("successfully join room");
  });
}

module.exports = { createRoom, removeUser };
