const express = require("express");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const rate = express.Router();
const luckyModel = require("../../../../modules/lucky/models");
const { getUserInfo } = require("../../../../utils/middleware");
const _ = require("lodash");

rate.get("/", getUserInfo, async function (req, res) {
	try {
		const user = req.user;
		let data_rate = {
			rate: 0,
			name: "Level default",
			level: "",
			type: "",
		};
		const currentTime = helpers.date.getNow("YYYY-MM-DD");
		console.log(user, "user");
		if (!_.isEmpty(user)) {
			// get rate by level
			const rateLevel = await luckyModel.findOne(COLLECTIONS.RATE, { status: 1, level: user?.level, type: "default" });
			if (rateLevel) {
				data_rate = {
					rate: rateLevel?.rate,
					name: rateLevel?.name,
					level: rateLevel?.level,
					type: rateLevel?.type,
				};
			}
			// get rate by date
			const rateDate = await luckyModel.findOne(COLLECTIONS.RATE, { status: 1, date: currentTime, type: "lottery" });
			if (rateDate) {
				data_rate = {
					rate: rateDate?.rate,
					name: rateDate?.name,
					level: rateDate?.level,
					type: rateDate?.type,
				};
			}

			// get rate by User
			const rateUser = await luckyModel.findOne(COLLECTIONS.RATE, { status: 1, type: "user", uid: user?._id });
			if (rateUser) {
				data_rate = {
					rate: rateUser?.rate,
					name: rateUser?.name,
					level: rateUser?.level,
					type: rateUser?.type,
				};
			}
		} else {
			let rate_default = await helpers.setting.get_value_setting("rate-default");
			console.log(rate_default, "rate_default");
			data_rate = {
				rate: rate_default | 70,
				name: "Level default",
				level: "",
				type: "",
			};
		}

		const result = {
			error: 0,
			message: "Success",
			data: data_rate,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

rate.get("/level", async function (req, res) {
	try {
		const levels = await luckyModel.findAll(COLLECTIONS.RATE, { status: 1, type: "default" }, " ", { level: 1 });
		const result = {
			error: 0,
			message: "Success",
			data: levels,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

module.exports = rate;
