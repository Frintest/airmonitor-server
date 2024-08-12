import { setDBConnection } from "./db.js";
import { airStateHandlers } from "./handlers/air-state/air-state-handlers.js";
import { airHistoryHandlers } from "./handlers/air-history/air-history-handlers.js";
import { airStandardsHandlers } from "./handlers/air-standards/air-standards-handlers.js";

export const main = (io) => {
   const onConnection = (socket) => {
      console.log(`Socket ${socket.id} connect`);

      const db_connection = setDBConnection();
      airStateHandlers(socket, db_connection);
      airHistoryHandlers(socket, db_connection);
      airStandardsHandlers(socket, db_connection);

      socket.on("disconnect", () => {
         console.log(`Socket ${socket.id} disconnect`);
      });
   };

   io.on("connection", onConnection);
};
