import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = process.env.MYSQL_PORT;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

export const createDBConnection = async () => {
   const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      decimalNumbers: true,
      timezone: "+03:00", // Moscow // TODO time on server
   });

   return connection;
};

export const destroyDBConnection = async (connection) => {
   await connection.end();
};
