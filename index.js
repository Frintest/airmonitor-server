const fs = require('fs');
const https = require("https");
const express = require("express");
const { Server } = require("socket.io");

const PORT = 3001;
const app = express();

const directory = `/etc/letsencrypt/live/airmonitor.servermc.ru-0001`;
const ssl = {
	key: fs.readFileSync(`${directory}/privkey.pem`),
	cert: fs.readFileSync(`${directory}/fullchain.pem`),
};

const httpsServer = https.createServer(ssl, app);

const io = new Server(httpsServer, {
	cors: {
		origin: [
			"http://localhost:3000",
			"https://airmonitor.servermc.ru"
		]
	}
});

const { setDBConnection } = require("./db.js");

const { airStateHandlers } = require("./handlers/air-state/air-state-handlers.js");
const { airHistoryHandlers } = require("./handlers/air-history/air-history-handlers.js");
const { airStandardsHandlers } = require("./handlers/air-standards/air-standards-handlers.js");


const onConnection = async (socket) => {
	console.log(`Socket ${socket.id} connect`);

	const db_connection = await setDBConnection();

	airStateHandlers(socket, db_connection);
	airHistoryHandlers(socket, db_connection);
	airStandardsHandlers(socket, db_connection);

	socket.on("disconnect", () => {
		console.log(`Socket ${socket.id} disconnect`);
	});
};

io.on('connection', onConnection);


httpsServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
