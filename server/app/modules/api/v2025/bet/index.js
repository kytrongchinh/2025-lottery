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

		const notValidError = listDataValid.find((error) => error);

		if (notValidError) throw new ValidationError(ERRORS.INVALID_DATA, notValidError);

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
			publisher: requestData?.schedule?.publisher_id,
			publisher_id: requestData?.schedule?.publisher_id,
			publisher_name: requestData?.schedule?.publisher_name,
			publisher_slug: requestData?.schedule?.publisher_slug,
			schedule: requestData?.schedule?._id,
			schedule_id: requestData?.schedule?._id,
			date: requestData?.schedule?.date,
			month: requestData?.schedule?.month,
			year: requestData?.schedule?.year,
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
