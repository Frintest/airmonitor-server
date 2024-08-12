import https from "https";
import express from "express";
import { Server } from "socket.io";
import fs from "fs";
import { main } from "./main.js";

const app = express();
const directory = `/etc/letsencrypt/live/airmonitor.servermc.ru-0001`;
const ssl = {
   key: fs.readFileSync(`${directory}/privkey.pem`),
   cert: fs.readFileSync(`${directory}/fullchain.pem`),
};

const httpsServer = https.createServer(ssl, app);
const io = new Server(httpsServer, {
   cors: {
      origin: ["https://frintest.github.io"],
   },
});

main(io);

const PORT = 3001;
httpsServer.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
