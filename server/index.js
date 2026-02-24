import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config.js";
import { authorizationCheck, isSocketAuth } from "./middlewares/isAuth.js";
import Message from "./models/message.js";
import messageRouter from "./routes/message.js";
import userRouter from "./routes/user.js";

const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.use(isSocketAuth);

app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use("/user", userRouter);
app.use("/message", authorizationCheck, messageRouter);

// function deleteDemoUser() {
//   User.deleteMany({}).then(() => {
//     console.log('All users deleted');
//   }).catch((err) => {
//     console.error('Error deleting users:', err);
//   });
//   Message.deleteMany({}).then(() => {
//     console.log('All users deleted');
//   }).catch((err) => {
//     console.error('Error deleting users:', err);
//   });
// }
// deleteDemoUser()
connectDB();

// Track online users
const onlineUsers = new Set();

io.on("connection", (socket) => {
  socket.join(socket.userId);

  // Add user to online set and broadcast
  onlineUsers.add(socket.userId);
  io.emit("userConnected", socket.userId);

  // Send current online users list to newly connected client
  socket.emit("onlineUsers", Array.from(onlineUsers));

  socket.on("disconnect", () => {
    console.log("user disconnected");
    onlineUsers.delete(socket.userId);
    io.emit("userDisconnected", socket.userId);
  });

  socket.on("sendMessage", async ({ receiverId, content }) => {
    const senderId = socket.userId;
    try {
      const message = await Message.create({
        senderId,
        receiverId,
        content,
      });
      io.to([receiverId, senderId]).emit("receiveMessage", message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  });

  socket.on("typing", ({ receiverId }) => {
    const senderId = socket.userId;
    socket.to(receiverId).emit("typing", senderId);
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const senderId = socket.userId;
    socket.to(receiverId).emit("stopTyping", senderId);
  });

  socket.on("readMessage", async ({ receiverId }) => {
    const senderId = socket.userId;
    try {
      await Message.updateMany(
        { senderId: receiverId, receiverId: senderId, seen: false },
        { seen: true },
      );
      io.emit("readMessage", senderId);
    } catch (error) {
      console.log("Error updating message:", error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`http Server is running on port ${PORT}`);
});
