const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

var rooms = [];

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello KAD");
});

app.get("/image", (req, res) => {
  res.json({
    health: "ok",
    image:
      "https://images.unsplash.com/photo-1573804613658-6e8bc17661c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Z29vZ2xlJTIwbWVldHxlbnwwfHwwfHw%3D&w=1000&q=80",
  });
});

io.on("connection", (socket) => {
  socket.on("create_room", (name) => {
    const roomId = Math.random().toString(36).substring(7);
    socket.join(roomId);
    rooms.push({
      roomId: roomId,
      users: [{ name: name, id: socket.id, type: "admin" }],
    });
    console.log("ROOM CREATED", roomId);
    socket.emit("room_created", roomId);
  });

  socket.on("send_room_request_admins", ({ roomId, userDetails }) => {
    rooms.forEach((room) => {
      if (room.roomId === roomId) {
        room.users.forEach((user) => {
          if (user.type === "admin") {
            io.to(user.id).emit("join_room_request", {
              roomId: roomId,
              userDetails: userDetails,
            });
          }
        });
      }
    });
  });

  socket.on("join_room_accept", ({ roomId, userDetails }) => {
    socket.join(roomId);
    console.log("join_room_accept", userDetails);
    console.log(rooms.filter((room) => room.roomId === roomId)[0].users);
    io.to(userDetails.socketId).emit("request_accepted", {
      roomId: roomId,
      userDetails: userDetails,
      users: rooms.filter((room) => room.roomId === roomId)[0].users,
    });
    rooms
      .filter((room) => room.roomId === roomId)[0]
      .users.push({
        name: userDetails.name,
        id: userDetails.socketId,
        type: "member",
      });
  });

  socket.on("sending_signal", ({ to, signal, from, name }) => {
    io.to(to).emit("receiving_signal", { signal, from, name });
  });

  socket.on("returning_signal", ({ to, signal, from }) => {
    io.to(to).emit("receiving_returned_signal", { signal, id: socket.id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("leave_room", (roomId) => {
    console.log("leave_room", roomId);
    rooms.forEach((room) => {
      if (room.roomId === roomId) {
        room.users.forEach((user) => {
          io.to(user.id).emit("user_left", {
            peerID: socket.id,
          });
        });
      }
    });
    rooms = rooms.filter((room) => room.users.id !== socket.id);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
