const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

(async () => {
	const pool = mysql.createPool({
	    host: 'localhost',
	    user: 'sensor_user',
	    database: 'sensor',
	    password: 'jshdf^%hfjDfsbh$',
	}).promise();

	const app = express();
	app.use(cors({
	    origin: 'http://localhost:3000'
	}));

	const server = http.createServer(app);

	const io = new Server(server, {
	    cors: {
		origin: 'http://localhost:3000'
	    }
	});

	const getLastNote = async () => {
	    let [initial_data] = await pool.query(`SELECT * FROM Sensor ORDER BY id DESC LIMIT 1`);
	    let data = initial_data[0];

	    return [
		{
		    sensor_name: "pm1",
		    ui_name: "pm1",
		    unit: "ppm",
		    value: data.pm1,
		},
		{
		    sensor_name: "pm2",
		    ui_name: "pm2.5",
		    unit: "ppm",
		    value: data.pm2,
		},
		{
		    sensor_name: "pm10",
		    ui_name: "pm10",
		    unit: "ppm",
		    value: data.pm10,
		},
		{
			sensor_name: "temp",
			ui_name: "Температура",
			unit: "°C",
			value: data.temp,
		},
		{
			sensor_name: "humidity",
			ui_name: "Влажность",
			unit: "%",
			value: data.humidity,
		},
		{
			sensor_name: "CO2",
			ui_name: "CO2",
			unit: "ppm",
			value: data.CO2,
		},
		{
			sensor_name: "TVOC",
			ui_name: "TVOC",
			unit: "mg/m³",
			value: data.TVOC,
		},
	    ];
	};

	io.on('connection', socket => {
	    socket.emit('111', '123')
	    let p = new Promise((resolve, reject) => {
		resolve(getLastNote());
	    });

	    p.then(data => {
		socket.emit('getLastData', 'q');
		console.log(data);
	    });
	});

	//let data = getLastNote();
	//socket.emit('111', data);
	// setInterval(() => {console.log(1)}, 10000);

	//setInterval(async () => {let data = await getLastNote(); socket.emit('111', data)}, 10000);});

	server.listen(3001, () => {
	    console.log("Server is running...");
	});


	// const getNotes = async () => {
	// 	let data = await pool.query("SELECT * FROM Sensor");
	// 	return data[0];
	// };
	// let notes = await getNotes();

	// const getNote = async (id) => {
	// 	let [data] = await pool.query(`SELECT * FROM Sensor WHERE id = ${id}`);
	// 	return data[0];
	// };
	// let note = await getNote(4100);

	//const getLastNote = async () => {
	//	let [data] = await pool.query(`SELECT * FROM Sensor ORDER BY id DESC LIMIT 1`);
	//	return data[0];
	//};
	//let lastNote = await getLastNote();
	// API
	//app.get('/note', async (req, res) => {
	//	let data = await getLastNote();
		//res.send(data);
	//});

	//app.listen(3001, () => {
	//	console.log("Server is running");
	//});
})();
