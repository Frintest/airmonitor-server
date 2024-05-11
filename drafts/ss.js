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

const mysql = require("mysql2/promise");

io.on('connection', async (socket) => {
	console.log('Server connected');

	const connection = await mysql.createPool({
		host: 'localhost', // default
		port: 3306, // default
		user: 'sensor_user',
		database: 'sensor',
		password: 'jshdf^%hfjDfsbh$'
	});
	console.log('Database connected');

	const getAirState = async () => {
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

	const getHistorySocket = async () => {
		const airState = await getAirState();
		console.log(socket.id);
		socket.emit('airState: send', airState);
	};

	await getHistorySocket();
	let intervalId = setInterval(async () => {
		await getHistorySocket();
	}, 1000);

	socket.on("disconnect", () => {
		console.log('CLOSE!!!');
		clearInterval(intervalId);
	});
});

httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

