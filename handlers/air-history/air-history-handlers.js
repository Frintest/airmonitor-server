const { requestAirHistory } = require("./get-air-history.js");

const airHistoryHandlers = (socket, db_connection) => {
	const getAirHistory = async (db_connection, itemName) => {
		const airHistory = await requestAirHistory(db_connection, itemName);
		socket.emit("air-history:update", airHistory);
		console.log('air-history:update');
	};

	const getHistoryItem = (db_connection) => {
		socket.on('history-item:get', (itemName) => {
			getAirHistory(db_connection, itemName);
		});
	};

	getHistoryItem(db_connection);
}

module.exports = {
	airHistoryHandlers
}
