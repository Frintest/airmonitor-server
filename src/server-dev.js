import http from "http";
import express from "express";
import { Server } from "socket.io";
import { main } from "./main.js";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
   cors: {
      origin: ["http://localhost:3000"],
   },
});

main(io);

const PORT = 3001;
httpServer.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
