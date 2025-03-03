import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["https://chatapp-6kgqdeh4n-gunjan-patels-projects.vercel.app", "http://localhost:3000","https://vercel.com","https://chatapp-delta-sandy.vercel.app"],
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
      console.log(token,channelId)
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token Data:", tokenData);
      console.log(!tokenData,tokenData.id !== channelId,!tokenData.permissions?.viewChannel)
      if (!tokenData || tokenData.id !== channelId || !tokenData.permissions?.viewChannel) {
        console.log("❌ [Socket.IO] Invalid token data. Disconnecting...");
        return socket.disconnect(true);
      }
    } catch (error) {
      console.error("❌ [Socket.IO] Token verification failed:", error);
      return socket.disconnect(true);
    }

    if (!channelId) {
      console.log("❌ [Socket.IO] Missing channelId. Disconnecting...");
      return socket.disconnect(true);
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
