let groups = [];

const createRoom = async (pendingList, rooms) => {
  if (pendingList.length >= 2) {
    const newGroups = makePairs(pendingList);

    groups = [...groups, ...newGroups];
    console.log("cmduehdf", groups);

    newGroups.forEach((group, index) => {
      // here create room unique id
      const roomId = `room_${groups.length + index}`;
      rooms[roomId] = group;
    });
  } else {
    console.log("Waiting for another player to join...");
  }
};
const socketDisconnectHandler = async () => {
  console.log("user disconnected ");
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

module.exports = { createRoom, socketDisconnectHandler };
