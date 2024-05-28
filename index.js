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

	const airHistoryEvent = async (db_connection, itemName) => {
		const airHistory = await requestAirHistory(db_connection, itemName);
		console.log(airHistory);
		socket.emit("air-history:update", airHistory);
	};

	const getHistoryItemEvent = async (db_connection) => {
		socket.on('history-item:get', (itemName) => {
			airHistoryEvent(db_connection, itemName); // fix
		});
	};

	await airStateEvent(db_connection);
	await getHistoryItemEvent(db_connection);

	socket.on("disconnect", () => {
		console.log(`Socket ${socket.id} disconnect`);
	});
};

io.on('connection', onConnection);


httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
