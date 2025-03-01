import express from "express";
import { getIo } from "./ioConfig.js";

const router = express.Router();

router.post("/send-message", (req, res) => {
  const { channelId, message } = req.body;
  console.log(channelId,message)

  if (!channelId || !message) {
    return res.status(400).json({ error: "channelId and message are required" });
  }

  const io = getIo();
  io.of("/channel").to(channelId).emit("message", message);
  console.log(`📨 WebSocket: Message sent to /channel/${channelId}`, message);

  res.status(200).json({ success: true });
});

router.get("/send-message",(req,res)=>{
  console.log("working")
})

export default router;
