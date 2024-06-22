const { requestAirStandards } = require("./get-air-standards");

const airStandardsHandlers = async (socket, db_connection) => {
	const standards = await requestAirStandards(db_connection);
	socket.emit('standards:get', standards, () => {
		console.log("Event Confirm | standards:get");
	});
};

module.exports = {
	airStandardsHandlers
};
