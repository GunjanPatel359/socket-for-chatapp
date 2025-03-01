import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["https://chatapp-qgp4sw357-gunjan-patels-projects.vercel.app/", "http://localhost:3000","https://vercel.com"],
      methods: ["GET", "POST"],
    },
  });

  io.of("/channel").on("connection", (socket) => {
    const { channelId, token } = socket.handshake.query;

    if (!token) {
      console.log("❌ [Socket.IO] Missing token. Disconnecting...");
      return socket.disconnect(true);
    }

    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token Data:", tokenData);

      if (!tokenData || tokenData.id !== channelId || !tokenData.permissions.permission?.viewChannel) {
        console.log("❌ [Socket.IO] Invalid token data. Disconnecting...");
        return socket.disconnect(true);
      }
    } catch (error) {
      console.error("❌ [Socket.IO] Token verification failed:", error);
      return socket.disconnect(true);
    }

    if (!channelId) {
      console.log("❌ [Socket.IO] Missing channelId. Disconnecting...");
      return socket.disconnect();
    }

    console.log(`✅ [Socket.IO] User joined /channel/${channelId}`);
    socket.join(channelId);

    socket.on("disconnect", () => {
      console.log(`❌ [Socket.IO] User left /channel/${channelId}`);
    });
  });

  console.log("✅ WebSocket server initialized!");
  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("❌ Socket.IO not initialized!");
  }
  return io;
}
