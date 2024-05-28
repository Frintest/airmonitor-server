const mysql = require("mysql2/promise");

const setDBConnection = () => {
	const db_connection = mysql.createPool({
		host: 'localhost', // default
		port: 3306, // default
		user: 'sensor_user',
		database: 'sensor',
		password: 'jshdf^%hfjDfsbh$'
	});

	return db_connection;
};

module.exports = {
	setDBConnection
};
