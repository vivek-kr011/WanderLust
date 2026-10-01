let io;

const { Server } = require("socket.io");

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* ----------- USER ROOM ----------- */
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user:${userId}`);

      console.log(`User joined room: user:${userId}`);
    });

    /* ----------- HOST ROOM ----------- */
    socket.on("joinHostRoom", (hostId) => {
      socket.join(`host:${hostId}`);

      console.log(`Host joined room: host:${hostId}`);
    });

    /* ----------- DISCONNECT ----------- */
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized.");
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
