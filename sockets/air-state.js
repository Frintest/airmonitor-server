const getAirState = async (connection) => {
	const [rows] = await connection.query(`SELECT * FROM Sensor ORDER BY id DESC LIMIT 1`);
	const data = rows[0];

	return {
		pm1: {
			sensor_name: "pm1",
			ui_name: "pm<sub>1",
			unit: "μg/m<sup>3",
			value: data.pm1,
		},
		pm2: {
			sensor_name: "pm2",
			ui_name: "pm<sub>2.5",
			unit: "μg/m<sup>3",
			value: data.pm2,
		},
		pm10: {
			sensor_name: "pm10",
			ui_name: "pm<sub>10",
			unit: "μg/m<sup>3",
			value: data.pm10,
		},
		temp: {
			sensor_name: "temp",
			ui_name: "Температура",
			unit: "°C",
			value: data.temp,
		},
		humidity: {
			sensor_name: "humidity",
			ui_name: "Влажность",
			unit: "%",
			value: data.humidity,
		},
		CO2: {
			sensor_name: "CO2",
			ui_name: "CO<sub>2",
			unit: "μg/m<sup>3",
			value: data.CO2,
		},
		TVOC: {
			sensor_name: "TVOC",
			ui_name: "TVOC",
			unit: "μg/m<sup>3",
			value: data.TVOC,
		},
	};
};

module.exports = {
	getAirState
};
