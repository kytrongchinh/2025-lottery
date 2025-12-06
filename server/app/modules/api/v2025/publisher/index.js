const express = require("express");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const publisher = express.Router();
const luckyModel = require("../../../../modules/lucky/models");

publisher.get("/", async function (req, res) {
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
publisher.get("/list", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const region = parseInt(requestData?.region) || "south";
		const key = "PUBLISHER_REGION_" + region;
		let publishers = await libs.redis.get(key);
		if (publishers) {
			publishers = JSON.parse(publishers);
		} else {
			publishers = await luckyModel.findAll(COLLECTIONS.PUBLISHER, { status: 1, region_name: region }, "name slug description date region_name region status type periods");
			if (publishers) {
				libs.redis.set(key, JSON.stringify(publishers), 3600);
			}
		}
		const result = {
			error: 0,
			message: "Success",
			data: { publishers },
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error);
		const result = {
			error: MESSAGES?.[error?.message]?.CODE || -1,
			message: MESSAGES?.[error?.message]?.MSG || error.message,
			data: error?.data || null,
		};
		return utils.common.response(req, res, result, 400);
	}
});

module.exports = publisher;
