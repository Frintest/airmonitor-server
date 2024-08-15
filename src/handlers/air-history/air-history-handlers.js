import { getAirHistory } from "./get-air-history.js";

export const airHistoryHandlers = (socket, db_connection) => {
   socket.on("range-info:send", async (data) => {
      console.log("Event Confirm | range-info:send");

      const history = await getAirHistory(db_connection, data);

      socket.emit("air-history:update", history, () => {
         console.log("Event Confirm | air-history:update");
      });
   });
};
