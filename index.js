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

const { requestAirState } = require('./events/air-state.js');
const { requestAirHistory } = require('./events/air-history.js');

io.on('connection', async (socket) => {
	console.log('Server connected');

	const db_connection = await setConnection();

	let isChangeAirState = false;

	const airStateEvent = async (db_connection) => {
		const data = await requestAirState(db_connection);
		socket.emit("air-state:update", data);
		let prevData = data;

		let airStateInterval = setInterval(async () => {
			const data = await requestAirState(db_connection);
			isChangeAirState = JSON.stringify(prevData) !== JSON.stringify(data);
			prevData = data;

			if (isChangeAirState) {
				socket.emit("air-state:update", data);
				await airHistoryEvent(db_connection); // fix
			}
		}, 3000);

		socket.on("disconnect", () => {
			clearInterval(airStateInterval);
		});
	};

	const airHistoryEvent = async (db_connection) => {
		const airHistory = await requestAirHistory(db_connection);
		socket.emit("air-history:update", airHistory);
	};

	await airStateEvent(db_connection);
	await airHistoryEvent(db_connection);

	socket.on("disconnect", () => {
		console.log(`Socket ${socket.id} disconnect`);
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
