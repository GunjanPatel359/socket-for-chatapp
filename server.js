import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors"; 
import { initializeSocket } from "./ioConfig.js";
import messageRoutes from "./httpRoutes.js";

dotenv.config();

const PORT = process.env.WS_PORT || 4000;
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ["https://chatapp-qgp4sw357-gunjan-patels-projects.vercel.app/", "http://localhost:3000"], // Update with your frontend domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json()); // Enable JSON parsing
app.use("/", messageRoutes); // Use HTTP routes

// Initialize WebSocket Server
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 WebSocket & HTTP Server running on http://localhost:${PORT}`);
});
