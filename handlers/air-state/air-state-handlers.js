const { requestAirState } = require('./get-air-state.js');

const airStateHandlers = async (socket, db_connection) => {
	let isChangeAirState = false;

	const data = await requestAirState(db_connection);
	socket.emit("air-state:update", data, () => {
		console.log("Event Confirm | air-state:update");
	});

	let prevData = data;

	let airStateInterval = setInterval(async () => {
		const data = await requestAirState(db_connection);
		isChangeAirState = JSON.stringify(prevData) !== JSON.stringify(data);
		prevData = data;

		if (isChangeAirState) {
			socket.emit("air-state:update", data, () => {
				console.log("Event Confirm | air-state:update");
			});
			// await airHistoryEvent(db_connection, itemName); // fix
		}
	}, 3000);

	socket.on("disconnect", () => {
		clearInterval(airStateInterval);
	});
};

module.exports = {
	airStateHandlers
};
