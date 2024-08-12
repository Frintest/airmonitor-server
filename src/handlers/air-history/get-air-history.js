import moment from "moment";
import { createHistorySql } from "./create-history-sql.js";
import { selectByIntervals } from "./select-by-intervals.js";

export const requestAirHistory = async (db_connection, data) => {
   const { name, range, date, every } = data;

   const historySQL = createHistorySql(name, range, date);
   let [raw_history] = await db_connection.query(historySQL);
   raw_history.reverse();

   const selectedRows = selectByIntervals(raw_history, every);

   const createHistoryInfo = (history) => {
      let firstDate = history[0].timestamp;
      firstDate = moment(firstDate).format("MM/DD/YYYY");
      let lastDate = history[history.length - 1].timestamp;
      lastDate = moment(lastDate).format("MM/DD/YYYY");
      const info = { firstDate, lastDate };
      return info;
   };

   const history = selectedRows.map((item) => {
      return {
         value: item.value,
         timestamp: moment(item.timestamp).format("YYYY-MM-DD h:mm:ss"),
         // timestamp: item.timestamp
      };
   });

   const historyResult = {
      info: createHistoryInfo(selectedRows),
      history,
   };

   return historyResult;
};
