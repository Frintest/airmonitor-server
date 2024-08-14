import { createDBConnection, destroyDBConnection } from "./db.js";
import { airStateHandlers } from "./handlers/air-state/air-state-handlers.js";
import { airHistoryHandlers } from "./handlers/air-history/air-history-handlers.js";
import { airStandardsHandlers } from "./handlers/air-standards/air-standards-handlers.js";

export const main = (io) => {
   const onConnection = async (socket) => {
      console.log(`Socket ${socket.id} connect`);

      const db_connection = await createDBConnection();
      console.log("Create db connection");

      airStateHandlers(socket, db_connection);
      airHistoryHandlers(socket, db_connection);
      airStandardsHandlers(socket, db_connection);

      socket.on("disconnect", async () => {
         console.log(`Socket ${socket.id} disconnect`);
         await destroyDBConnection(db_connection);
         console.log("Destroy db connection");
      });
   };

   io.on("connection", async (io) => {
      await onConnection(io);
   });
};
