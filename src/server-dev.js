const { createServer } = require("http");
const { Server } = require("socket.io");
import { main } from "./main.js";

const httpServer = createServer();
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
