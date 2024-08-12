export const createHistorySql = (name, range, date) => {
   const createRangeSql = (range) => {
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

   const rangeSql = createRangeSql(range);

   const historySQL = `
		SELECT ${name} AS value, timestamp
		FROM Sensor
		${rangeSql}
		ORDER BY id DESC
	`;

   // WHERE timestamp >= NOW() - INTERVAL 2 DAY
   // WHERE timestamp BETWEEN '2024-07-03 08:00:56' AND '2024-07-03 23:20:56'
   // LIMIT 2000

   return historySQL;
};
