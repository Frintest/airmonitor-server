import { requestAirStandards } from "./get-air-standards.js";

export const airStandardsHandlers = async (socket, db_connection) => {
   const standards = await requestAirStandards(db_connection);
   socket.emit("standards:get", standards, () => {
      console.log("Event Confirm | standards:get");
   });
};
