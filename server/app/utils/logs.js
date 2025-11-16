const logs = (module.exports = {});

logs.logReceive = function (req, user = {} || req.user, type = "", result = {}, options = {}) {
	try {
		const logModel = require("../modules/mlogs/models/cp_logs");
		const date_info = utils.sac_mu.set_date_play();
		let userAgent = typeof req.headers === "object" && typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "";
		let log = {
			name: `Log from ${user?.display_name} for ${type}`,
			uid: user?._id,
			from: type,
			ip: logs.getClientIP(req),
			user: user?._id,
			path: req.originalUrl,
			user_agent: userAgent,
			date: date_info?.date,
			time: date_info?.full_date,
			data: Object.assign(req.body, req.files, req.query, options),
			result: result,
			month: date_info?.month_year,
			type: type,
			status: 1,
		};
		if (Object.keys(log).length > 0) {
			const logIns = new logModel(log);
			setTimeout(function () {
				logIns.save();
			}, 1000);
		}
		return true;
	} catch (error) {
		console.log(`error==>`, error);
		return false;
	}
};

logs.getClientIP = function (req) {
	const clientIp = req.headers && req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress;
	return clientIp;
};

logs.escapeRegExpChars = function (text) {
	return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : null;
};
