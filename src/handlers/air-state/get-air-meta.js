const requestFirstTimestamp = async (db_connection) => {
   const sql = "SELECT timestamp FROM Sensor ORDER BY id ASC LIMIT 1";
   const [rows] = await db_connection.query(sql);
   const timestamp = rows[0].timestamp;
   return timestamp;
};

export const requestLastTimestamp = async (db_connection) => {
   const sql = "SELECT timestamp FROM Sensor ORDER BY id ASC LIMIT 1";
   const [rows] = await db_connection.query(sql);
   const timestamp = rows[0].timestamp;
   return timestamp;
};

export const requestAirMeta = async (db_connection) => {
   const firstTimestamp = requestFirstTimestamp(db_connection);
   const lastTimestamp = requestLastTimestamp(db_connection);
   const meta = {
      firstDate: firstTimestamp,
      lastDate: lastTimestamp,
   };
   return meta;
};
