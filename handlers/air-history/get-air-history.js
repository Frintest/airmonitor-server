const requestAirHistory = async (connection, itemName) => {
	let [rows] = await connection.query(`SELECT ${itemName} AS value, timestamp FROM Sensor ORDER BY id DESC LIMIT 60`);
	rows.reverse();

	const formatDate = (timestamp) => {
		let date = new Date(timestamp).toISOString();
		date = date.split("T");
		const time = date[1].split(".")[0]
		format = `${date[0]} ${time}`;
		return format;
	};

	const history = rows.map((item) => {
		return {
			name: itemName,
			value: item.value,
			timestamp: formatDate(item.timestamp)
		}
	});

	return history;
};

module.exports = {
	requestAirHistory
};
