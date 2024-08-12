import { requestAirState } from "./get-air-state.js";
import { requestAirStateInfo } from "./get-air-state-info.js";

export const airStateHandlers = async (socket, db_connection) => {
	let isChangeAirState = false;

	const state = await requestAirState(db_connection);
	const info = await requestAirStateInfo(db_connection);
	const data = { info, state };

	socket.emit("air-state:update", data, () => {
		console.log("Event Confirm | air-state:update");
	});

	let prevData = data;

	let airStateInterval = setInterval(async () => {
		const state = await requestAirState(db_connection);
		const info = await requestAirStateInfo(db_connection);
		const data = { info, state };
		isChangeAirState = JSON.stringify(prevData) !== JSON.stringify(data);
		prevData = data;

		if (isChangeAirState) {
			socket.emit("air-state:update", data, () => {
				console.log("Event Confirm | air-state:update");
			});
		}
	}, 10000);

	socket.on("disconnect", () => {
		clearInterval(airStateInterval);
	});
};
