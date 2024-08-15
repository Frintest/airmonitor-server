import { requestAirState } from "./get-air-state.js";
import { requestLastTimestamp, requestAirMeta } from "./get-air-meta.js";

export const airStateHandlers = (socket, db_connection) => {
   const sleep = (duration) => {
      return new Promise((resolve) => setTimeout(resolve, duration));
   };

   let timestampCache = null;
   let isChangeAirState = false;
   const checkInterval = 5000;
   let isSocketConnection = true;

   const checkUpdatingAirState = async () => {
      const timestamp = await requestLastTimestamp(db_connection);
      isChangeAirState = String(timestampCache) !== String(timestamp);
      timestampCache = timestamp;

      if (isChangeAirState) {
         isChangeAirState = false;
         const info = await requestAirMeta(db_connection);
         const state = await requestAirState(db_connection);
         const data = { info, state };
         socket.emit("air-state:update", data, () => {
            console.log("Event Confirm | air-state:update");
         });
      }

      await sleep(checkInterval);
      if (isSocketConnection) {
         await checkUpdatingAirState();
      }
   };

   checkUpdatingAirState();

   socket.on("disconnect", () => {
      isSocketConnection = false;
   });
};
