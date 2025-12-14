const express = require("express");
const digit = express.Router();
const luckyModel = require("../../../lucky/models");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const baseWorker = require("../../worker/index");
digit.get("/", async function (req, res) {
	try {
		const result = {
			error: 0,
			message: "Success",
			data: {},
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

digit.get("/load-more", async function (req, res) {
	try {
		const schedules = await luckyModel.findAll(COLLECTIONS.SCHEDULE, {
			status: 1,
		});
		if (schedules.length > 0) {
			for (let index = 0; index < schedules.length; index++) {
				const schedule = schedules[index];
				const data_in = {
					publisher_id: schedule?.publisher_id,
					publisher: schedule?.publisher.toString(),
					publisher_name: schedule?.publisher_name,
					publisher_slug: schedule?.publisher_slug,
					date: schedule?.date,
					month: schedule?.month,
					year: schedule?.year,
					digit2: Object.values(schedule?.digit2).flat(),
					digit3: Object.values(schedule?.digit3).flat(),
					digit4: Object.values(schedule?.digit4).flat(),
					status: 1,
				};
				luckyModel.create(COLLECTIONS.DIGIT, data_in);
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

digit.get("/digit2-top", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const today = helpers.date.getToday();
		const month = helpers.date.format(today, "MM");
		const year = helpers.date.format(today, "YYYY");
		const type = requestData?.type || "month";
		const limit = parseInt(requestData?.limit) || 10;
		const where = {
			status: 1,
		};
		if (requestData?.publisher) {
			where["publisher_slug"] = requestData?.publisher;
		}
		if (type == "month") {
			where.month = month;
		}
		if (type == "year") {
			where.year = year;
		}
		let sort = { total: -1 };
		if (requestData?.weight == "bottom") {
			sort = { total: 1 };
		}

		const query = [
			{
				$match: where,
			},
			{ $unwind: "$digit2" },
			{
				$group: {
					_id: "$digit2",
					total: { $sum: 1 },
				},
			},
			{ $sort: sort },
			{ $limit: limit },
		];

		const data = await luckyModel.aggregateCustom(COLLECTIONS.DIGIT, query);
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
digit.get("/digit3-top", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const today = helpers.date.getToday();
		const month = helpers.date.format(today, "MM");
		const year = helpers.date.format(today, "YYYY");
		const type = requestData?.type || "month";
		const limit = parseInt(requestData?.limit) || 10;
		const where = {
			status: 1,
		};
		if (requestData?.publisher) {
			where["publisher_slug"] = requestData?.publisher;
		}
		if (type == "month") {
			where.month = month;
		}
		if (type == "year") {
			where.year = year;
		}
		let sort = { total: -1 };
		if (requestData?.weight == "bottom") {
			sort = { total: 1 };
		}
		const query = [
			{
				$match: where,
			},
			{ $unwind: "$digit3" },
			{
				$group: {
					_id: "$digit3",
					total: { $sum: 1 },
				},
			},
			{ $sort: sort },
			{ $limit: limit },
		];

		const data = await luckyModel.aggregateCustom(COLLECTIONS.DIGIT, query);
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
digit.get("/digit4-top", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const today = helpers.date.getToday();
		const month = helpers.date.format(today, "MM");
		const year = helpers.date.format(today, "YYYY");
		const type = requestData?.type || "month";
		const limit = parseInt(requestData?.limit) || 10;
		const where = {
			status: 1,
		};
		if (requestData?.publisher) {
			where["publisher_slug"] = requestData?.publisher;
		}
		if (type == "month") {
			where.month = month;
		}
		if (type == "year") {
			where.year = year;
		}
		let sort = { total: -1 };
		if (requestData?.weight == "bottom") {
			sort = { total: 1 };
		}
		const query = [
			{
				$match: where,
			},
			{ $unwind: "$digit4" },
			{
				$group: {
					_id: "$digit4",
					total: { $sum: 1 },
				},
			},
			{ $sort: sort },
			{ $limit: limit },
		];

		const data = await luckyModel.aggregateCustom(COLLECTIONS.DIGIT, query);
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
module.exports = digit;
