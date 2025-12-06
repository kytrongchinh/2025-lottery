const { PROCESS_STATUS, COLLECTIONS } = require("../../app/configs/constants");
const jwt = require("jsonwebtoken");
const auth = (module.exports = {});
const luckyModel = require("../modules/lucky/models");
const moment = require("moment");

auth.generateAccessToken = (user) => {
	return jwt.sign(user, appConfig.AUTHENTICATION.ACCESS_TOKEN_SECRET, {
		expiresIn: "8h",
	});
};

auth.generateRefreshToken = (user) => {
	return jwt.sign(
		{
			username: user.username,
		},
		appConfig.AUTHENTICATION.REFRESH_TOKEN_SECRET,
		{ expiresIn: "90d" }
	);
};

function jwtVerify(token, options = null) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, appConfig.AUTHENTICATION.ACCESS_TOKEN_SECRET, options, function (error, decoded) {
			if (error) return reject(null);
			return resolve(decoded);
		});
	});
}

auth.verifyToken = async (token) => {
	try {
		let decoded = null;
		const checktoken = await luckyModel.findOne(COLLECTIONS.USER, { token: token });
		// console.log(checktoken, "checktoken");
		if (!checktoken) {
			// console.log("-----------------------11111--------------------");

			decoded = await jwtVerify(token);
			if (!decoded) {
				throw new Error("Invalid");
			}
		} else {
			// console.log("-----------------------222222--------------------");
			const current = moment().format("X");
			const time_check = parseInt(checktoken.expired_token);
			if (current > time_check) {
				throw new Error("Invalid 1");
			}
			// token
			decoded = await jwtVerify(token);
			if (!decoded) {
				throw new Error("Invalid 2");
			}
		}
		// console.log("-------------------------------------------");
		// console.log("decoded", decoded);
		return decoded;
	} catch (error) {
		console.log(error);
		return null;
	}
};

auth.verifyTokenNew = async (token) => {
	try {
		let decoded = null;
		decoded = await jwtVerify(token, { algorithms: ["HS256"] });
		if (!decoded) {
			throw new Error("Invalid 2");
		}
		console.log("-------------------------------------------");
		console.log("decoded", decoded);
		return decoded;
	} catch (error) {
		console.log(error);
		return null;
	}
};
