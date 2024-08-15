import { selectByIntervals } from "./select-by-intervals.js";
import moment from "moment";

export const getAirHistory = async (db_connection, data) => {
   const selectedRows = await selectByIntervals(db_connection, data);

   const history = selectedRows.map((item) => ({
      value: item.value,
      timestamp: moment(item.timestamp).format("YYYY-MM-DD h:mm:ss"),
   }));

   const createHistoryMeta = (history) => {
      let firstDate = history[0].timestamp;
      let lastDate = history[history.length - 1].timestamp;
      firstDate = moment(firstDate).format("MM/DD/YYYY");
      lastDate = moment(lastDate).format("MM/DD/YYYY");
      const info = { firstDate, lastDate };
      return info;
   };

   const historyResult = {
      info: createHistoryMeta(selectedRows),
      history,
   };

   return historyResult;
};
