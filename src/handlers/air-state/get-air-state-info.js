export const requestAirStateInfo = async (db_connection) => {
   const firstDateSQL = "SELECT timestamp FROM Sensor ORDER BY id ASC LIMIT 1";
   const lastDateSQL = "SELECT timestamp FROM Sensor ORDER BY id DESC LIMIT 1";

   let [[firstDate]] = await db_connection.query(firstDateSQL);
   let [[lastDate]] = await db_connection.query(lastDateSQL);
   firstDate = firstDate.timestamp;
   lastDate = lastDate.timestamp;

   return {
      firstDate,
      lastDate,
   };
};
