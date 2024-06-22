const { requestAirStandards } = require("./get-air-standards.js");

const airStandardsHandlers = async (socket, db_connection) => {
	const standards = await requestAirStandards(db_connection);
	socket.emit('standards:get', standards, data, () => {
		console.log("Event Confirm | standards:get");
	});
};

module.exports = {
	airStandardsHandlers
};
