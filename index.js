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

const { getAirState } = require('./sockets/air-state.js');
const aiHistorySocket = require('./sockets/air-history.js');

io.on('connection', async (socket) => {
	console.log('Server connected');

	const db_connection = await setConnection();

	await aiHistorySocket(socket, db_connection);

	const data = await getAirState(db_connection);
	socket.emit("air-state:update", data);
	let prevData = data;

	let airStateInterval = setInterval(async () => {
		const data = await getAirState(db_connection);
		const isChangeData = JSON.stringify(prevData) !== JSON.stringify(data);
		prevData = data;

		if (isChangeData) {
			socket.emit("air-state:update", data);
		}
	}, 3000);

	let airHistoryInterval = setInterval(async () => {
		await aiHistorySocket(socket, db_connection);
	}, 3000);

	socket.on("disconnect", () => {
		console.log(`Socket ${socket.id} disconnect`);
		clearInterval(airStateInterval);
		clearInterval(airHistoryInterval);
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
