const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = 3001;
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000", "http://airmonitor.servermc.ru"]
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


httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
