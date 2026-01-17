const express = require("express");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const report = express.Router();
const luckyModel = require("../../../lucky/models");
const { getUserInfo, checkLoginToken } = require("../../../../utils/middleware");
const _ = require("lodash");



report.get("/", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		const requestData = helpers.admin.filterXSS(req.query);
		const conditions = {
			status: 1,
			user_id: user?._id
		};

		let page = 1;
		if (requestData?.page) page = parseInt(requestData?.page);
		page = page < 1 ? 1 : page;
		const limit = parseInt(requestData?.limit) || 6;
		const skip = limit * (page - 1);
		const sort = {
			createdAt: -1,
		};
		const items = await luckyModel.find(COLLECTIONS.USET_BET_DATES, conditions, "user_id username num_bet profit loss total_amount digit_two digit_three digit_four folk_game date", sort, limit, skip);
		const total = await luckyModel.count(COLLECTIONS.USET_BET_DATES, conditions);
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

report.get("/user-bet", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;

		const conditions = {
			status: 1,
			user_id: user?._id
		};


		const userBet = await luckyModel.findOne(COLLECTIONS.USET_BETS, conditions, "user_id username num_bet profit loss total_amount digit_two digit_three digit_four folk_game date");

		const result = {
			error: 0,
			message: "Success",
			data: {
				item: userBet,
				user,
			},
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});


module.exports = report;
