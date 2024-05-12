module.exports = async (socket, connection) => {
	const getHistory = async () => {
		let [rows] = await connection.query('SELECT pm2 AS value, timestamp FROM Sensor ORDER BY id DESC LIMIT 10');
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
				value: item.value,
				timestamp: formatDate(item.timestamp)
			}
		});

		return history;
	};

	const airHistory = await getHistory();
	socket.emit("air-history:update", airHistory);
}
