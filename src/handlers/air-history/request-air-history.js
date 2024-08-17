export const requestAirHistory = async (name, range, date, db_connection) => {
   const selectIntervalSql = (range) => {
      switch (range) {
         case "custom": {
            const dateFrom = date.from;
            const dateTo = date.to;
            return `WHERE timestamp BETWEEN '${dateFrom}' AND '${dateTo}'`;
         }

         case "last-hour":
            return "WHERE timestamp >= NOW() - INTERVAL 1 HOUR";

         case "last-day":
            return "WHERE timestamp >= NOW() - INTERVAL 1 DAY";

         case "last-week":
            return "WHERE timestamp >= NOW() - INTERVAL 1 WEEK";

         case "last-month":
            return "WHERE timestamp >= NOW() - INTERVAL 1 MONTH";

         case "last-year":
            return "WHERE timestamp >= NOW() - INTERVAL 1 YEAR";
      }
   };

   const intervalSql = selectIntervalSql(range);
   const sql = `
		SELECT ${name} AS value, timestamp
		FROM Sensor
		${intervalSql}
	`;
   const [history] = await db_connection.query(sql);
   return history;
};
