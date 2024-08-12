import { requestAirHistory } from "./get-air-history.js";

export const airHistoryHandlers = (socket, db_connection) => {
   const getAirHistory = async (db_connection, itemName) => {
      const history = await requestAirHistory(db_connection, itemName);

      socket.emit("air-history:update", history, () => {
         console.log("Event Confirm | air-history:update");
      });
   };

   const getRangeInfo = (db_connection) => {
      socket.on("range-info:send", (data) => {
         console.log("Event Confirm | range-info:send");
         getAirHistory(db_connection, data);
      });
   };

   getRangeInfo(db_connection);
};
