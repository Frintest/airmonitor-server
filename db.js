const mysql = require("mysql2/promise");

const setConnection = async () => {
	const connection = await mysql.createPool({
		host: 'localhost', // default
		port: 3306, // default
		user: 'sensor_user',
		database: 'sensor',
		password: 'jshdf^%hfjDfsbh$'
	});
	return connection;
};

module.exports = {
	setConnection
};
