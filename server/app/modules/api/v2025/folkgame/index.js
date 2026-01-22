const express = require("express");
const { MESSAGES, COLLECTIONS, USER_BET, FOLKGAME_BET, ERRORS } = require("../../../../configs/constants");
const folkgame = express.Router();
const folkGameModel = require("../../../folkgame/models");
const luckyModel = require("../../../lucky/models");
const { getUserInfo } = require("../../../../utils/middleware");
const _ = require("lodash");
const { checkLoginToken } = require("../../../../utils/middleware");
const { checkEmpty } = require("../../../../helpers/campaign_validate");
const { ValidationError } = require("../../../../utils/error");

function transformByGroup(data) {
	const map = new Map();

	for (const item of data) {
		if (!map.has(item.group)) {
			map.set(item.group, {
				label: item.label,
				description: item.description,
				cols: item.cols,
				items: [],
				group: item?.group
			});
		}

		map.get(item.group).items.push({
			name: item.item_name,
			rate: item.item_rate,
			description: item.item_des,
			type: item.item_type,
		});
	}

	return Array.from(map.values());
}
folkgame.get("/", getUserInfo, async function (req, res) {
	try {
		const rates = await folkGameModel.findAll(COLLECTIONS.FOLKGAME_RATES, { status: 1 }, "", { weight: 1 });
		const data = transformByGroup(rates);

		const result = {
			error: 0,
			message: "Success",
			data: data,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});


folkgame.post("/create", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		const requestData = helpers.admin.filterXSS(req.body);
		let listColumns = [...FOLKGAME_BET];

		listColumns = listColumns.map((column) => {
			let columnValue = requestData[column.id];
			if (columnValue) columnValue = helpers.admin.filterXSS(typeof columnValue === "string" ? columnValue.trim() : columnValue);
			return { ...column, value: columnValue };
		});

		const listDataValid = [checkEmpty(listColumns)];
		console.log(listDataValid, "listDataValid");

		const notValidError = listDataValid.find((error) => error);
		console.log(notValidError, "notValidError");

		if (notValidError) throw new ValidationError(ERRORS.INVALID_DATA, notValidError);
		//check publisher
		const publisher = await luckyModel.findOne(COLLECTIONS.PUBLISHER, { slug: requestData?.schedule?.publisher_slug });
		if (!publisher) {
			throw new ValidationError(ERRORS.NOT_FOUND, publisher);
		}
		const schedule = await luckyModel.findOne(COLLECTIONS.SCHEDULE, { _id: requestData?.schedule?._id, status: 0 });
		if (!schedule) {
			throw new ValidationError(ERRORS.NOT_FOUND, publisher);
		}
		const currentTime = helpers.date.getNow("YYYY-MM-DD HH:mm");
		const date_schedule = `${schedule?.date} ${publisher?.timeClose || "16:00"}`;
		if (currentTime > date_schedule) {
			throw new ValidationError(ERRORS.INVALID_DATA, currentTime);
		}
		const date_info = utils.bud_mu.set_date();
		// check schedule
		const last_login = utils.bud_mu.lastLogin(req);
		const data_bet = {
			user_id: user?._id.toString(),
			username: user?.username,
			user: user?._id.toString(),
			amount: requestData?.folk?.amount,
			selected: requestData?.folk?.selected,
			count: requestData?.folk?.selected?.length,
			totalBet: requestData?.computFolk?.totalBet,
			expectedWin: requestData?.computFolk?.expectedWin,
			checkedItems: requestData?.checkedItems,
			betInfo: requestData,
			publisher: schedule?.publisher_id,
			publisher_id: schedule?.publisher_id,
			publisher_name: schedule?.publisher_name,
			publisher_slug: schedule?.publisher_slug,
			schedule: schedule?._id,
			schedule_id: schedule?._id,
			date_schedule: schedule?.date,
			date: date_info?.date,
			month: date_info?.month,
			year: date_info?.year,
			is_win: false,
			level: user?.level,
			profit: 0,
			status: 0,
			ip: last_login?.ip || "",
			browser: last_login?.userAgent || "",
			timestamp: last_login?.timestamp || 0,
		};
		const ins = await folkGameModel.create(COLLECTIONS.FOLKGAME_BETS, data_bet);
		if (!ins?.status) {
			throw new ValidationError(ERRORS.CREATE_DATA_FAIL, { ins });
		}

		let user_level = user?.level;

		// check create user bet date
		const user_bet_date = await luckyModel.findOne(COLLECTIONS.USET_BET_DATES, { date: date_info?.date, status: 1, user_id: user?._id.toString() });
		if (user_bet_date) {
			// update
			const data_update = {
				$inc: { num_bet: 1, total_amount: data_bet?.amount * data_bet?.count },
			};
			data_update["folk_game"] = {
				number: user_bet_date?.folk_game?.number + 1,
				values: user_bet_date?.folk_game?.values + (data_bet?.amount * data_bet?.count || data_bet?.totalBet),
			};

			await luckyModel.updateOne(COLLECTIONS.USET_BET_DATES, { _id: user_bet_date?._id }, data_update);

		} else {
			// create new
			const data_create = {
				user_id: user?._id.toString(),
				username: user?.username,
				user: user?._id.toString(),
				num_bet: 1,
				total_amount: data_bet?.amount * data_bet?.count || 0,
				profit: 0,
				loss: 0,
				status: 1,
				date: date_info?.date,
				month: date_info?.month,
				year: date_info?.year,
				digit_two: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_three: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_four: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				folk_game: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
			};

			data_create.folk_game = {
				number: 1,
				values: data_bet?.amount * data_bet?.count,
			};
			await luckyModel.create(COLLECTIONS.USET_BET_DATES, data_create);
		}
		// check user bet

		// check create user bet date
		const user_bet = await luckyModel.findOne(COLLECTIONS.USET_BETS, { status: 1, user_id: user?._id.toString() });
		if (user_bet) {
			// update
			const data_update = {
				$inc: { num_bet: 1, total_amount: data_bet?.amount * data_bet?.count },
			};
			data_update["folk_game"] = {
				number: user_bet?.folk_game?.number + 1,
				values: user_bet?.folk_game?.values + data_bet?.amount * data_bet?.count,
			};

			const ubet = await luckyModel.updateOne(COLLECTIONS.USET_BETS, { _id: user_bet?._id }, data_update);
			user_level = await utils.bud_mu.getUserLevel(ubet?.msg.total_amount);
			// update user level
			if (user_level != user?.level) {
				await luckyModel.updateOne(COLLECTIONS.USER, { _id: user?._id }, { level: user_level });
			}
			luckyModel.updateOne(COLLECTIONS.USET_BETS, { _id: user_bet?._id }, { level: user_level });
		} else {
			// create new
			const data_create = {
				user_id: user?._id.toString(),
				username: user?.username,
				user: user?._id.toString(),
				num_bet: 1,
				total_amount: data_bet?.amount * data_bet?.count,
				profit: 0,
				loss: 0,
				status: 1,
				digit_two: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_three: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_four: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				folk_game: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				level: user?.level,
			};


			data_create.folk_game = {
				number: 1,
				values: data_bet?.amount * data_bet?.count,
			};

			const ubet = await luckyModel.create(COLLECTIONS.USET_BETS, data_create);

			user_level = await utils.bud_mu.getUserLevel(ubet?.msg.total_amount);
			if (user_level != user?.level) {
				await luckyModel.updateOne(COLLECTIONS.USER, { _id: user?._id }, { level: user_level });
			}
			// update user level
			luckyModel.updateOne(COLLECTIONS.USET_BETS, { _id: user_bet?._id }, { level: user_level });
		}


		// check create user bet date
		const publisher_bet_date = await luckyModel.findOne(COLLECTIONS.PUBLISHER_BET_DATES, { date: date_info?.date, status: 1, publisher_id: schedule?.publisher_id });
		if (publisher_bet_date) {
			// update
			const data_update = {
				$inc: { num_bet: 1, total_amount: data_bet?.amount * data_bet?.count },
			};

			data_update["folk_game"] = {
				number: publisher_bet_date?.folk_game?.number + 1,
				values: publisher_bet_date?.folk_game?.values + data_bet?.amount * data_bet?.count,
			};

			await luckyModel.updateOne(COLLECTIONS.PUBLISHER_BET_DATES, { _id: publisher_bet_date?._id }, data_update);

		} else {
			// create new
			const data_create = {
				publisher_id: schedule?.publisher_id.toString(),
				publisher_name: schedule?.publisher_name,
				publisher: schedule?.publisher_id.toString(),
				num_bet: 1,
				num_user: 1,
				total_amount: data_bet?.amount * data_bet?.count,
				profit: 0,
				loss: 0,
				status: 1,
				date: date_info?.date,
				month: date_info?.month,
				year: date_info?.year,
				digit_two: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_three: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_four: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				folk_game: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
			};


			data_create.folk_game = {
				number: 1,
				values: data_bet?.amount * data_bet?.count,
			};

			await luckyModel.create(COLLECTIONS.PUBLISHER_BET_DATES, data_create);
		}

		// check create user bet date
		const publisher_bet = await luckyModel.findOne(COLLECTIONS.PUBLISHER_BETS, { status: 1, publisher_id: schedule?.publisher_id });
		if (publisher_bet) {
			// update
			const data_update = {
				$inc: { num_bet: 1, total_amount: data_bet?.amount * data_bet?.count },
				folk_game: {
					number: publisher_bet?.folk_game?.number + 1,
					values: publisher_bet?.folk_game?.values + data_bet?.amount * data_bet?.count,
				}
			};

			await luckyModel.updateOne(COLLECTIONS.PUBLISHER_BETS, { _id: publisher_bet?._id }, data_update);

		} else {
			// create new
			const data_create = {
				publisher_id: schedule?.publisher_id.toString(),
				publisher_name: schedule?.publisher_name,
				publisher: schedule?.publisher_id.toString(),
				num_bet: 1,
				num_user: 1,
				total_amount: data_bet?.amount * data_bet?.count,
				profit: 0,
				loss: 0,
				status: 1,
				digit_two: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_three: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				digit_four: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				folk_game: {
					number: 0, values: 0, profit: 0,
					loss: 0
				},
				level: user?.level,
			};

			data_create.folk_game = {
				number: 1,
				values: data_bet?.amount * data_bet?.count,
			};

			await luckyModel.create(COLLECTIONS.PUBLISHER_BETS, data_create);
		}

		const result = {
			error: 0,
			message: "Success",
			data: {
				bet: ins?.msg,
				user_level: user_level,
			},
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {
			error: MESSAGES?.[error?.message]?.CODE || -1,
			message: MESSAGES?.[error?.message]?.MSG || error.message,
			data: error?.data || null,
		};
		return utils.common.response(req, res, result, 400);
	}
});

folkgame.get("/history", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		console.log("user", user)
		const requestData = helpers.admin.filterXSS(req.query);

		const conditions = {
			user_id: user?._id,
		};

		let page = 1;
		if (requestData?.page) page = parseInt(requestData?.page);
		page = page < 1 ? 1 : page;
		const limit = parseInt(requestData?.limit) || 6;
		const skip = limit * (page - 1);
		const sort = {
			createdAt: -1,
		};
		const items = await folkGameModel.find(COLLECTIONS.FOLKGAME_BETS, conditions, "amount selected count publisher_name publisher_slug date status level is_win createdAt", sort, limit, skip);
		const total = await folkGameModel.count(COLLECTIONS.FOLKGAME_BETS, conditions);
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

folkgame.get("/detail", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		const requestData = helpers.admin.filterXSS(req.query);
		const id = requestData?.id;

		const conditions = {
			user_id: user?._id,
			_id: id,
		};

		const item = await folkGameModel.findOne(COLLECTIONS.FOLKGAME_BETS, conditions);
		const result = {
			error: 0,
			message: "Success",
			data: item,
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});
folkgame.get("/result-all", async function (req, res) {
	try {
		const date = "2026-01-20";
		const conditions = {
			date_schedule: date,
			status: 0,
		};
		const baseWorker = require("../../worker/index");

		const items = await folkGameModel.findAll(COLLECTIONS.FOLKGAME_BETS, conditions, "selected date date_schedule publisher_id schedule_id amount count _id status");
		console.log(`load results bet date: ${date} total: ${items?.length}`);

		if (items.length > 0) {
			for (let index = 0; index < items.length; index++) {
				const item = items[index];
				setTimeout(() => {
					console.log(`Index ${index} Call Folkgame ID >>>>${item?._id}`);
					baseWorker.call_result_folkgame_bet({ item });
				}, 100 + index * 200);
			}
		}

		return utils.common.response(req, res, items.length);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

module.exports = folkgame;
