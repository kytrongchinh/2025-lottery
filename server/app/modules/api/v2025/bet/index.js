const express = require("express");
const user = express.Router();
const jwt = require("jsonwebtoken");
const luckyModel = require("../../../lucky/models");
const { MESSAGES, COLLECTIONS, ERRORS, USER_BET } = require("../../../../configs/constants");
const { checkEmpty } = require("../../../../helpers/campaign_validate");
const { ValidationError } = require("../../../../utils/error");
user.post("/create", async function (req, res) {
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

module.exports = user;
