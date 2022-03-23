let users = [];

//join a user to chat

const joinUser = (id, user, room) => {
  const newUser = {
    id,
    name: user.name,
    avatar: user.imageUrl,
    room,
  };
  users.push(newUser);
  return newUser;
};

//get the current user

const getCurrentUser = (id) => {
  console.log(users);
  console.log("ID", id);
  const user = users.find((user) => user.id === id);
  return user;
};

// user leave

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// all users in a room

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
