import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { main } from "./main.js";

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000"],
	},
});

main(io);

dotenv.config();
const PORT = process.env.APP_PORT;
httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
