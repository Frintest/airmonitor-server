import { requestAirHistory } from "./request-air-history.js";
import { computeInterval } from "./compute-interval.js";

export const selectByIntervals = async (db_connection, data) => {
   const selectRows = (raw_history, originalInterval) => {
      let selectedRows = [];
      let beginRow = raw_history[0];
      let beginDate = new Date(beginRow.timestamp);
      let beginTime = beginDate.getTime();
      selectedRows.push(beginRow);

      for (let i = 1; i < raw_history.length - 2; i++) {
         const currentRow = raw_history[i];
         const currentDate = new Date(currentRow.timestamp);
         const currentTime = currentDate.getTime();
         const prevInterval = currentTime - beginTime;

         const nextRow = raw_history[i + 1];
         const nextDate = new Date(nextRow.timestamp);
         const nextTime = nextDate.getTime();
         const nextInterval = nextTime - beginTime;

         if (
            prevInterval < originalInterval &&
            nextInterval > originalInterval
         ) {
            const prevTimeDiff = originalInterval - prevInterval;
            const nextTimeDiff = nextInterval - originalInterval;
            let resultRow = {};

            if (prevTimeDiff < nextTimeDiff) {
               resultRow = currentRow;
            } else {
               resultRow = nextRow;
            }

            selectedRows.push(resultRow);
            beginRow = resultRow;
            beginDate = new Date(beginRow.timestamp);
            beginTime = beginDate.getTime();
         }
      }

      return selectedRows;
   };

   const { name, range, date, every } = data;
   const raw_history = await requestAirHistory(
      name,
      range,
      date,
      db_connection,
   );
   const interval = computeInterval(every);
   const history = selectRows(raw_history, interval);
   return history;
};
