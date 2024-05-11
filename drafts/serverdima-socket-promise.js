const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'sensor_user',
    database: 'sensor',
    password: 'jshdf^%hfjDfsbh$',
});

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

const getLastNote = () => {
    let [data] = pool.query(`SELECT * FROM Sensor ORDER BY id DESC LIMIT 1`);
    return data[0];
};

io.on('connection', socket => {
    let data = getLastNote();
    socket.emit('111', data);
});

server.listen(3001, () => {
    console.log("Server is running...");
});