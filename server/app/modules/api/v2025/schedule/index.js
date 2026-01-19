const express = require("express");
const schedule = express.Router();
const luckyModel = require("../../../../modules/lucky/models");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const baseWorker = require("../../worker/index");
schedule.get("/", async function (req, res) {
	try {
		const update = await luckyModel.updateMany(COLLECTIONS.SCHEDULE, { publisher_name: "Bến Tre" }, { publisher_slug: "xsbtr" });
		const result = {
			error: 0,
			message: "Success",
			data: { update },
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/create", async function (req, res) {
	try {
		const datestart = "2023-01-01";
		const dateend = "2030-12-31";
		console.log("datestart", datestart);
		console.log("dateend", dateend);
		const days = await helpers.date.set_date_play(datestart, dateend);
		if (days.length > 0) {
			for (let index = 0; index < days.length; index++) {
				const day = days[index];
				const dddd = day?.dddd;
				const publishers = await luckyModel.findAll(COLLECTIONS.PUBLISHER, { date: { $in: [dddd] }, status: 1 });
				const data_ins = [];
				if (publishers.length > 0) {
					for (let index = 0; index < publishers.length; index++) {
						const publisher = publishers[index];
						const data_add = {
							name: day?.date,
							publisher_id: publisher?._id,
							publisher: publisher?._id.toString(),
							publisher_name: publisher?.name,
							publisher_slug: publisher?.slug,
							date: day?.date,
							month: day?.month,
							year: day?.year,
							g8: [],
							g7: [],
							g6: [],
							g5: [],
							g4: [],
							g3: [],
							g2: [],
							g1: [],
							gdb: [],
							period: day?.d,
							day: day?.dddd,
							status: 0,
							results: { g8: [], g7: [], g6: [], g5: [], g4: [], g3: [], g2: [], g1: [], gdb: [] },
							win: { g8: [], g7: [], g6: [], g5: [], g4: [], g3: [], g2: [], g1: [], gdb: [] },
							digit2: { g8: [], g7: [], g6: [], g5: [], g4: [], g3: [], g2: [], g1: [], gdb: [] },
							digit3: { g8: [], g7: [], g6: [], g5: [], g4: [], g3: [], g2: [], g1: [], gdb: [] },
							digit4: { g8: [], g7: [], g6: [], g5: [], g4: [], g3: [], g2: [], g1: [], gdb: [] },
						};
						data_ins.push(data_add);
					}
				}
				if (data_ins.length > 0) {
					luckyModel.insertMany(COLLECTIONS.SCHEDULE, data_ins);
				}
			}
		}

		const result = {
			error: 0,
			message: "Success",
			data: days.length,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "my-gift");
		const result = {
			error: MESSAGES?.[error?.message]?.CODE || -1,
			message: MESSAGES?.[error?.message]?.MSG || error.message,
			data: error?.data || null,
		};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/load", async function (req, res) {
	try {
		const date = "2025-12-08"; // dd-mm-yyyy giống URL
		const date_get = helpers.date.format(date, "DD-MM-YYYY");
		const data = await utils.bud_mu.fetchXSMN(date_get);
		const labelMap = {
			g8: "G8",
			g7: "G7",
			g6: "G6",
			g5: "G5",
			g4: "G4",
			g3: "G3",
			g2: "G2",
			g1: "G1",
			gdb: "G.Đặc Biệt",
		};
		if (data?.length > 0) {
			for (let index = 0; index < data.length; index++) {
				const item = data[index];
				const results = item?.prizes;
				const results_convert = Object.keys(results).map((key) => {
					const item = {
						label: labelMap[key],
						values: results[key],
					};
					if (key === "gdb") {
						item["special"] = true;
					}

					return item;
				});
				const data_update = {
					g8: item?.prizes?.g8,
					g7: item?.prizes?.g7,
					g6: item?.prizes?.g6,
					g5: item?.prizes?.g5,
					g4: item?.prizes?.g4,
					g3: item?.prizes?.g3,
					g2: item?.prizes?.g2,
					g1: item?.prizes?.g1,
					gdb: item?.prizes?.gdb,
					results: item?.prizes,
					prizes: results_convert,
					digit2: {},
					digit3: {},
					digit4: {},
					status: 1,
				};
				const prizes = item?.prizes;
				if (prizes) {
					const last2DigitsPrizes = {};
					for (const key in prizes) {
						last2DigitsPrizes[key] = prizes[key].map((num) => num.slice(-2));
					}
					data_update.digit2 = last2DigitsPrizes;

					const prizes3Digits = {};
					for (const key in prizes) {
						prizes3Digits[key] = prizes[key]
							.filter((num) => num.length >= 3) // chỉ giữ số có từ 3 chữ số
							.map((num) => num.slice(-3)); // lấy 3 số cuối
					}
					data_update.digit3 = prizes3Digits;

					const prizes4Digits = {};
					for (const key in prizes) {
						prizes4Digits[key] = prizes[key]
							.filter((num) => num.length >= 4) // chỉ giữ số có từ 4 chữ số
							.map((num) => num.slice(-4)); // lấy 4 số cuối
					}
					data_update.digit4 = prizes4Digits;
				}
				const up = await luckyModel.updateOne(COLLECTIONS.SCHEDULE, { publisher_name: item?.province, publisher_slug: item?.matinh, date: date, status: 0 }, data_update);
			}
		}
		const result = {
			error: 0,
			message: "Success",
			data: data,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/load-more", async function (req, res) {
	try {
		const datestart = "2025-12-01";
		const dateend = "2025-12-22";
		const schedules = await luckyModel.findAll(COLLECTIONS.SCHEDULE, {
			status: 0,
			date: {
				$gte: datestart,
				$lte: dateend,
			},
		});
		if (schedules.length > 0) {
			for (let index = 0; index < schedules.length; index++) {
				const schedule = schedules[index];
				setTimeout(() => {
					baseWorker.call_result_lottey({ date: schedule?.date });
				}, 1000 * index);
			}
		}
		const result = {
			error: 0,
			message: "Success",
			data: schedules.length,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/update-data", async function (req, res) {
	try {
		const schedules = await luckyModel.findAll(COLLECTIONS.SCHEDULE, {
			status: 1,
		});
		const labelMap = {
			g8: "G8",
			g7: "G7",
			g6: "G6",
			g5: "G5",
			g4: "G4",
			g3: "G3",
			g2: "G2",
			g1: "G1",
			gdb: "G.Đặc Biệt",
		};
		if (schedules.length > 0) {
			for (let index = 0; index < schedules.length; index++) {
				const schedule = schedules[index];
				const results = schedule?.results;
				const data = Object.keys(results).map((key) => {
					const item = {
						label: labelMap[key],
						values: results[key],
					};
					if (key === "gdb") {
						item["special"] = true;
					}

					return item;
				});
				luckyModel.updateOne(COLLECTIONS.SCHEDULE, { _id: schedule?._id }, { prizes: data });
			}
		}
		const result = {
			error: 0,
			message: "Success",
			data: schedules.length,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/next", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		let today = helpers.date.getToday();
		const house = helpers.date.getNow("HH:mm");
		console.log("house", house);
		if (house >= "16:00") {
			today = helpers.date.getTimeNext(today, 1);
		}
		const publisher = requestData?.publisher;
		const schedule = await luckyModel.findOne(
			COLLECTIONS.SCHEDULE,
			{
				status: 0,
				date: {
					$gte: today,
					$lte: helpers.date.getTimeNext(today, 7),
				},
				publisher_slug: publisher,
			},
			"name publisher_id publisher_name publisher_slug date month year period day status"
		);
		const result = {
			error: 0,
			message: "Success",
			data: schedule,
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/result", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const today = helpers.date.getToday();
		const publisher = requestData?.publisher;
		const date = requestData?.date || today;
		const conditions = {
			status: 1,
			date: {
				$gte: helpers.date.getTimeNext(today, -7),
				$lt: today,
			},
			publisher_slug: publisher,
		};
		if (requestData?.date) {
			conditions.date = date;
		}
		const schedule = await luckyModel.findOne(
			COLLECTIONS.SCHEDULE,
			conditions,
			"name publisher_id publisher_name publisher_slug date month year period day status g8 g7 g6 g5 g4 g3 g2 g1 gdb results prizes digit2 digit3 digit4"
		);
		const result = {
			error: 0,
			message: "Success",
			data: schedule,
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/result-by-date", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const publisher = requestData?.publisher;
		const date = requestData?.date;
		const type = requestData?.type;
		let time = 8;
		const conditions = {
			status: 1,
			date: date,
			publisher_slug: publisher,
		};
		if (type == "pre") {
			time = -8;
			conditions.date = {
				$gt: helpers.date.getTimeNext(date, time),
				$lt: date,
			};
		} else {
			time = 8;
			conditions.date = {
				$gt: date,
				$lt: helpers.date.getTimeNext(date, time),
			};
		}

		const schedule = await luckyModel.findOne(
			COLLECTIONS.SCHEDULE,
			conditions,
			"name publisher_id publisher_name publisher_slug date month year period day status g8 g7 g6 g5 g4 g3 g2 g1 gdb results prizes digit2 digit3 digit4"
		);
		const result = {
			error: 0,
			message: "Success",
			data: schedule,
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/result-publisher", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);

		const publisher = requestData?.publisher;
		const conditions = {
			status: 1,
			publisher_slug: publisher,
		};

		let page = 1;
		if (requestData?.page) page = parseInt(requestData?.page);
		page = page < 1 ? 1 : page;
		const limit = parseInt(requestData?.limit) || 6;
		const skip = limit * (page - 1);
		const sort = {
			date: -1,
		};
		const items = await luckyModel.find(
			COLLECTIONS.SCHEDULE,
			conditions,
			"name publisher_id publisher_name publisher_slug date month year period day status g8 g7 g6 g5 g4 g3 g2 g1 gdb results prizes digit2 digit3 digit4",
			sort,
			limit,
			skip
		);
		const total = await luckyModel.count(COLLECTIONS.SCHEDULE, conditions);
		const result = {
			error: 0,
			message: "Success",
			data: {
				items,
				total,
				page,
				limit,
			},
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

schedule.get("/publisher", async function (req, res) {
	try {

		const date_info = utils.bud_mu.set_date();
		const hour = helpers.date.getToday("HH");
		let date = date_info?.date;
		if (hour > 15) {
			date = date?.tomorrow;
		}
		const schedule = await luckyModel.findOne(COLLECTIONS.SCHEDULE, { date: date });
		const publisher = await luckyModel.findOne(COLLECTIONS.PUBLISHER, { _id: schedule?.publisher_id })
		const result = {
			error: 0,
			message: "Success",
			data: {
				schedule,
				publisher
			},
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

module.exports = schedule;
