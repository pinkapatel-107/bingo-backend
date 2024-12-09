let groups = [];

const createRoom = async (pendingList, rooms) => {
  if (pendingList.length >= 2) {
    const newGroups = makePairs(pendingList);

    groups = [...groups, ...newGroups];
    // console.log("cmduehdf", groups);

    newGroups.forEach((group, index) => {
      // here create room unique id
      const roomId = `room_${groups.length + index}`;
      rooms[roomId] = group;
    });
  } else {
    console.log("Waiting for another player to join...");
  }
};

const removeUser = async (socket, pending_list, rooms) => {
  console.log("User disconnected: ", socket.id);

  const index = pending_list.indexOf(socket.id);
  if (index > -1) {
    pending_list.splice(index, 1);
  }

  for (const room in rooms) {
    for (const player in rooms[room]) {
      if (rooms[room][player] === socket.id) {
        delete rooms[room][player];
      }
    }

    if (Object.keys(rooms[room]).length === 0) {
      delete rooms[room];
    }
  }

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

module.exports = { createRoom, removeUser };
