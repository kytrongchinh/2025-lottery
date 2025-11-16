"use strict";

const Queue = require("bull");
const moment = require("moment");
const _ = require("lodash");
const appConfig = require("../../../configs");
const { REDIS_CONFIG } = require("../../../configs/redis.constant");

const options = { removeOnSuccess: true, removeOnComplete: true, removeOnFailure: true, timeout: 20000 };

const config_bull = {
	redis: { ...REDIS_CONFIG, enableReadyCheck: false },
	defaultJobOptions: { ...options },
	prefix: REDIS_CONFIG.keyPrefix,
};

if (appConfig.env != "develop") {
	config_bull.settings = {
		// Enable trustProxy to handle X-Forwarded-For header
		trustProxy: true,
	};
}

global.callProcessTest = new Queue("callProcessOK__" + appConfig.env, config_bull);
callProcessTest.setMaxListeners(0);
callProcessTest.process(async (job) => {
	try {
		const { item } = job.data;

		return true;
	} catch (error) {
		console.log(error, "error");
		return false;
	}
});

class base_worker {
	constructor() {}

	async test_worker(data) {
		const job = await callProcessTest.add(data, { delay: 5000 });

		return new Promise((res, rej) => {
			callProcessTest.on("completed", (jobjob, result) => {
				if (job?.id == jobjob?.id) {
					console.log(jobjob?.id, "jobjob?.id");
					job.remove();
					res(result);
				}
			});
			callProcessTest.on("error", (err) => {
				console.log("data", err);
				rej(err);
			});
			callProcessTest.on("failed", (err) => {
				console.log("data", err);
				rej(err);
			});
		});
	}
}

module.exports = new base_worker();
