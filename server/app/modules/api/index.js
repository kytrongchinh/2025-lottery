/**
 * API path: /api
 */
const express = require("express");
const api = express();
api.use("/v2025", require("./v2025/index"));
api.use("/zalo_service", require("./zalo_service"));

const baseWorker = require("../api/worker/index");

const { CronJob } = require("cron");
const luckyModel = require("../lucky/models");
const { COLLECTIONS } = require("../../configs/constants");
const moment = require("moment");

api.post("/apply_setting", async function (req, res) {
	const admin_userdata = req.session.admin_userdata;
	if (typeof admin_userdata === "undefined" || admin_userdata === null) {
		return res.json({ status: "Forbidden" });
	}

	req.session.menu_layout = req.body.zsl_menu;
	req.session.language = req.body.zsl_language;
	const i18n = require("../../configs/i18n.config");
	i18n.setLocale(req.session.language);
	// console.log(i18n.getLocale(), "sssssssssss");
	res.setLocale(req.session.language);
	// req.session.admin_menu = await helpers.admin.menus(req.session.admin_userdata.role)
	return res.json({ status: 1 });
});

const job = new CronJob(
	"0 16,30 16 * * *", // cronTime
	async function () {
		try {
			const moment = require("moment");
			const current = moment();
			let totday = current.format("YYYY-MM-DD");

			const schedule = await luckyModel.findOne(COLLECTIONS.SCHEDULE, { status: 0, date: totday });
			if (schedule) {
				baseWorker.call_result_lottey({ date: schedule?.date });
				console.log(`load data schedule==>`, schedule?.date);
			}
		} catch (error) {
			// Handle errors if the request fails
			console.error("Cron run error", error.message);
		}
	}, // onTick
	null, // onComplete
	true // start
	// "America/Los_Angeles" // timeZone
);

module.exports = api;
