import { readFileSync } from "fs";
import { createServer } from "https";
// import { Server } from "socket.io";
// import { main } from "./main.js";

const directory = `/etc/letsencrypt/live/airmonitor.servermc.ru-0001`;
const ssl = {
	key: readFileSync(`${directory}/privkey.pem`),
	cert: readFileSync(`${directory}/fullchain.pem`),
};

const httpsServer = createServer(ssl);
// const io = new Server(httpsServer, {
// 	cors: {
// 		origin: ["https://frintest.github.io"],
// 	},
// });

// main(io);

const PORT = 3001;
httpsServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
