const requestAirStandards = async (db_connection) => {
	const [rows] = await db_connection.query(`SELECT * FROM Standards`);

	const standards = {};

	const createStandards = () => {
		rows.forEach(item => {
			const name = item.attr;
			const isExist = name != "pm1" && name != "temp" && name != "humidity" && name != "eCO2";
			// const isExist = item.isExist;
			standards[name] = {
				isExist,
				content: isExist ? [] : null,
				source: isExist ? item.source : null,
			};
		});
	};

	const fullContent = () => {
		rows.forEach(item => {
			const name = item.attr;
			const isExist = name != "pm1" && name != "temp" && name != "humidity" && name != "eCO2";
			const obj = {
				value: item.value,
				text: item.description,
				level: item.level
			};
			// const isExist = item.isExist;
			if (isExist) {
				standards[name] = {
					...standards[name],
					content: [...standards[name].content, obj],
				};
			}
		});
	};

	createStandards();
	fullContent();

	return standards;
};

module.exports = {
	requestAirStandards
};


// const standards = {
// 	pm1: {},
// 	temp: {},
// 	humidity: {},
// 	pm2: {
// 		content: [
// 			{ value: "75", text: "Хорошо", level: 1 },
// 			{ value: "115", text: "Лёгкое загрязнение", level: 2 },
// 			{ value: "150", text: "Умеренное  загрязнение", level: 3 },
// 			{ value: "250", text: "Сильное загрязнение", level: 4 },
// 			{ value: "500", text: "Опасно", level: 5 },
// 		],
// 		source: "China Standard GB 3095—2012",
// 	},
// 	pm10: {
// 		content: [
// 			{ value: "150", text: "Хорошо", level: 1 },
// 			{ value: "250", text: "Лёгкое загрязнение", level: 2 },
// 			{ value: "350", text: "Умеренное  загрязнение", level: 3 },
// 			{ value: "420", text: "Сильное загрязнение", level: 4 },
// 			{ value: "600", text: "Опасно", level: 5 },
// 		],
// 		source: "China Standard GB 3095—2012",
// 	},
// 	TVOC: {
// 		content: [
// 			{ value: "0.3", text: "Хорошо", level: 1 },
// 			{ value: "1", text: "Лёгкое загрязнение", level: 2 },
// 			{ value: "3", text: "Умеренное  загрязнение", level: 3 },
// 			{ value: "10", text: "Сильное загрязнение", level: 4 },
// 			{ value: "10+", text: "Опасно", level: 5 },
// 		],
// 		source: "German Indoor Air Guidance Values",
// 	},
// 	CO2: {
// 		content: [
// 			{ value: "1000", text: "Хорошо", level: 1 },
// 			{ value: "2000", text: "Умеренное содержание", level: 2 },
// 			{ value: "3000", text: "Высокое содержание", level: 3 },
// 			{ value: "3000+", text: "Опасно", level: 4 },
// 		],
// 		source: "China Standard GB/T 18883—2002",
// 	},
// 	eCO2: {},
// };
