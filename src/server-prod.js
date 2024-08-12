import { readFileSync } from "fs";
import { createServer } from "https";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { main } from "./main.js";

const directory = `/etc/letsencrypt/live/airmonitor.servermc.ru-0001`;
const ssl = {
	key: readFileSync(`${directory}/privkey.pem`),
	cert: readFileSync(`${directory}/fullchain.pem`),
};

const httpsServer = createServer(ssl);
const io = new Server(httpsServer, {
	cors: {
		origin: ["https://frintest.github.io"],
	},
});

main(io);

dotenv.config();
const PORT = process.env.APP_PORT;
httpsServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
