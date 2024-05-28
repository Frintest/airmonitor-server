const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = 3001;
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ['http://localhost:3000', 'http://airmonitor.servermc.ru']
	}
});

const setConnection = require('./db.js');

const { requestAirState } = require('./handlers/air-state.js');
const { airHistoryHandlers } = require('./handlers/air-history/air-history-handlers.js');

const onConnection = async (socket) => {
	console.log('Server connected');

	const db_connection = await setConnection();

	let isChangeAirState = false;

	const airStateEvent = async (db_connection, itemName) => {
		const data = await requestAirState(db_connection);
		socket.emit("air-state:update", data);
		let prevData = data;

		let airStateInterval = setInterval(async () => {
			const data = await requestAirState(db_connection);
			isChangeAirState = JSON.stringify(prevData) !== JSON.stringify(data);
			prevData = data;

			if (isChangeAirState) {
				socket.emit("air-state:update", data);
				// await airHistoryEvent(db_connection, itemName); // fix
			}
		}, 3000);

		socket.on("disconnect", () => {
			clearInterval(airStateInterval);
		});
	};

	await airStateEvent(db_connection);

	airHistoryHandlers(socket, db_connection);

	socket.on("disconnect", () => {
		console.log(`Socket ${socket.id} disconnect`);
	});
};

io.on('connection', onConnection);


httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
