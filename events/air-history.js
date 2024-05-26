const requestAirHistory = async (connection) => {
	let [rows] = await connection.query(`SELECT ${"CO2"} AS value, timestamp FROM Sensor ORDER BY id DESC LIMIT 60`);
	rows.reverse();

	const formatDate = (timestamp) => {
		let date = new Date(timestamp).toISOString();
		date = date.split("T");
		const time = date[1].split(".")[0]
		format = `${date[0]} ${time}`;
		return format;
	};

	let history = rows.map((item) => {
		return {
			name: "pm2",
			value: item.value + 1000,
			timestamp: formatDate(item.timestamp)
		}
	});

	return history;
};

module.exports = {
	requestAirHistory
};
