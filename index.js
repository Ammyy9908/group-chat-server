const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const formatMessage = require("./utils/messages");
const socketio = require("socket.io");
const connectDb = require("./utils/db");
const auth_route = require("./routes/auth");
const room_route = require("./routes/room");
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

app.use(cors());
app.use(express.json());
app.use("/api", auth_route);
app.use("/roomapi", room_route);
app.get('/',(res,res)=>{
res.send("api working});

// database connection
connectDb()
  .then((connected) => {
    if (connected) {
      console.log("Database connected");
    } else {
      console.log("Database connection failed");
    }
  })
  .catch((e) => {
    console.log("Database connection failed", e);
  });
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  // console.log("User connected", socket.id);

  socket.on("join", ({ user, roomname }) => {
    const new_user = joinUser(socket.id, user, roomname);
    // console.log(new_user);
    socket.join(new_user.room);
    socket.emit("message", formatMessage("Admin", "Welcome to the chat"));

    socket.broadcast
      .to(new_user.room)
      .emit(
        "message",
        formatMessage("Admin", `A ${user.name} user has joined the chat`)
      );

    // send room info when user joins
    io.to(new_user.room).emit("roomUsers", {
      room: new_user.room,
      users: getRoomUsers(new_user.room),
    });
  });

  socket.on("chatmessage", (message) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("channel-message", formatMessage(user, message));
  });

  socket.on("typing", ({ user, id }) => {
    // console.log(user, id);
    const user_data = getCurrentUser(id);
    socket.broadcast
      .to(user_data.room)
      .emit("typing", `${user_data.name} is typing...`);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Admin", `A ${user.name} has left the chat`)
      );

      // send room info when user joins
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
