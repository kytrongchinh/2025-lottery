const express = require("express");
const bet = express.Router();
const jwt = require("jsonwebtoken");
const luckyModel = require("../../../lucky/models");
const { MESSAGES, COLLECTIONS, ERRORS, USER_BET } = require("../../../../configs/constants");
const { checkEmpty } = require("../../../../helpers/campaign_validate");
const { ValidationError } = require("../../../../utils/error");
const { checkLoginToken } = require("../../../../utils/middleware");
bet.post("/create", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		const requestData = helpers.admin.filterXSS(req.body);
		let listColumns = [...USER_BET];

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
		const date_schedule = `${schedule?.date} 16:00`;
		if (currentTime > date_schedule) {
			throw new ValidationError(ERRORS.INVALID_DATA, currentTime);
		}
		// check schedule

		const data_bet = {
			user_id: user?._id.toString(),
			user: user?._id.toString(),
			digit: requestData?.number,
			amount: requestData?.amount,
			rate: requestData?.rate,
			numbers: requestData?.numbers,
			number: requestData?.number,
			type: requestData?.type,
			type_bet: requestData?.type_bet,
			count: requestData?.count,
			totalBet: requestData?.totalBet,
			expectedWin: requestData?.expectedWin,
			checkedItems: requestData?.checkedItems,
			betInfo: requestData,
			publisher: schedule?.publisher_id,
			publisher_id: schedule?.publisher_id,
			publisher_name: schedule?.publisher_name,
			publisher_slug: schedule?.publisher_slug,
			schedule: schedule?._id,
			schedule_id: schedule?._id,
			date: schedule?.date,
			month: schedule?.month,
			year: schedule?.year,
			is_win: false,
			profit: 0,
			status: 0,
		};
		const ins = await luckyModel.create(COLLECTIONS.BET, data_bet);
		if (!ins?.status) {
			throw new ValidationError(ERRORS.CREATE_DATA_FAIL, { ins });
		}
		const result = {
			error: 0,
			message: "Success",
			data: ins?.msg,
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

bet.get("/history", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
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
		const items = await luckyModel.find(COLLECTIONS.BET, conditions, "digit amount rate count publisher_name publisher_slug date status is_win createdAt", sort, limit, skip);
		const total = await luckyModel.count(COLLECTIONS.BET, conditions);
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

bet.get("/detail", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		const requestData = helpers.admin.filterXSS(req.query);
		const id = requestData?.id;

		const conditions = {
			user_id: user?._id,
			_id: id,
		};

		const item = await luckyModel.findOne(COLLECTIONS.BET, conditions);
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

bet.get("/result", async function (req, res) {
	try {
		const date = "2025-12-08";
		const conditions = {
			date: date,
			status: 0,
		};

		const item = await luckyModel.findOne(COLLECTIONS.BET, conditions);
		const grouped = {};
		if (item) {
			const checkedItems = item?.checkedItems;

			Object.entries(checkedItems).forEach(([key, value]) => {
				const [group, idxStr] = key.split("_");
				const index = Number(idxStr) - 1;

				if (!grouped[group]) grouped[group] = [];

				grouped[group][index] = value;
			});
			console.log(grouped, "grouped");
		}

		let winCount = 0;
		const resultData = {};
		const schedule = await luckyModel.findOne(COLLECTIONS.SCHEDULE, { status: 1, date: date, publisher_id: item?.publisher_id });
		const A = grouped;
		const B = item?.number;
		const wins = {};
		if (schedule && A) {
			let C = schedule?.digit2;
			if (item?.type == 3) {
				C = schedule?.digit3;
			}
			if (item?.type == 4) {
				C = schedule?.digit4;
			}
			for (const group in A) {
				const chooseArr = A[group];
				const resultDigits = C[group] || [];

				let isWin = false;

				chooseArr.forEach((selected, index) => {
					if (selected === true) {
						if (String(B).padStart(item?.type, "0") === resultDigits[index]) {
							isWin = true;
							winCount++;
						}
					}
				});

				resultData[group] = {
					choose: chooseArr,
					is_win: isWin,
					digit: B,
				};
				if (isWin) {
					wins[group] = {
						choose: chooseArr,
						is_win: isWin,
						digit: B,
					};
				}
			}
		}

		// tinh tien loi nhuan
		const profit = winCount * item?.amount * item?.rate;
		const is_win = winCount > 0 ? true : false;
		const data_win = {
			profit,
			is_win,
			wins,
			resultData,
			winCount,
			status: 1,
		};

		const update = luckyModel.updateOne(COLLECTIONS.BET, { _id: item?._id }, data_win);
		return utils.common.response(req, res, data_win);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

bet.get("/result-all", async function (req, res) {
	try {
		const date = "2025-12-08";
		const conditions = {
			date: date,
			status: 0,
		};
		const baseWorker = require("../../worker/index");

		const items = await luckyModel.findAll(COLLECTIONS.BET, conditions, "checkedItems date publisher_id number type amount rate _id status");
		if (items.length > 0) {
			for (let index = 0; index < items.length; index++) {
				const item = items[index];
				setTimeout(() => {
					console.log(`Index ${index} Call ID >>>>${item?._id}`);
					baseWorker.call_result_bet({ item });
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
module.exports = bet;
