const express = require("express");
const user = express.Router();
const jwt = require("jsonwebtoken");
const luckyModel = require("../../../lucky/models");
const { MESSAGES, COLLECTIONS, ERRORS } = require("../../../../configs/constants");
const { checkLoginToken } = require("../../../../utils/middleware");
user.get("/", checkLoginToken, async function (req, res) {
	try {
		const user = req.user;
		const result = {
			error: 0,
			message: "Success",
			data: user,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

user.post("/login", async (req, res) => {
	try {
		const requestData = helpers.admin.filterXSS(req.body);
		const { username, password } = requestData;
		const auth = await luckyModel.findOne(COLLECTIONS.USER, { username: username, status: 1 });
		if (!auth) {
			throw new ValidationError(ERRORS.NOT_FOUND, { msg: "Can not found user!" });
		}
		// Checking if credentials match
		if (password === auth.password) {
			//creating a access token
			const user = {
				username: auth.username,
				name: auth.name,
				description: auth.description,
				status: auth.status,
				id: auth?._id,
			};
			const accessToken = utils.auth.generateAccessToken(user);
			const decodedToken = jwt.decode(accessToken);
			if (!decodedToken) {
				// The expiration time is in seconds since the Unix epoch
				throw new Error("Failed to decode");
			}
			const expired_token = decodedToken.exp;
			// Creating refresh token not that expiry of refresh
			//token is greater than the access token

			const refreshToken = utils.auth.generateRefreshToken(user);
			const decodedRefreshToken = jwt.decode(refreshToken);
			if (!decodedRefreshToken) {
				// The expiration time is in seconds since the Unix epoch
				throw new Error("Failed to decode");
			}
			const expired_refresh_token = decodedRefreshToken.exp;

			luckyModel.updateOne(
				COLLECTIONS.USER,
				{ _id: auth._id },
				{ token: accessToken, expired_token: expired_token, refresh_token: refreshToken, expired_refresh_token: expired_refresh_token }
			);

			const result = {
				error: 0,
				message: "Success",
				data: {
					access_token: accessToken,
					refresh_token: refreshToken,
				},
			};
			return utils.common.response(req, res, result);
		} else {
			throw new Error("Unauthorized");
		}
	} catch (error) {
		console.log(error, "login");
		const result = {
			error: MESSAGES?.[error?.message]?.CODE || -1,
			message: MESSAGES?.[error?.message]?.MSG || error.message,
			data: error?.data || null,
		};
		return utils.common.response(req, res, result, 400);
	}
});

user.post("/refresh", async (req, res) => {
	try {
		const { refresh_token } = req.body;
		if (!refresh_token) {
			throw new Error("Can not found refresh_token!");
		}

		// check refresh token
		const auth = await luckyModel.findOne(COLLECTIONS.USER, { refresh_token: refresh_token, status: 1 });
		if (!auth) {
			throw new Error("Can not found user!");
		}
		// Verifying refresh token
		jwt.verify(refresh_token, appConfig.AUTHENTICATION.REFRESH_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				// Wrong Refesh Token
				throw new Error("Unauthorized");
			} else {
				// Correct token we send a new access token
				const user = {
					username: auth.username,
					name: auth.name,
					description: auth.description,
					status: auth.status,
					group: auth.group,
					level: auth.level,
				};

				const accessToken = utils.auth.generateAccessToken(user);
				const decodedToken = jwt.decode(accessToken);
				if (!decodedToken) {
					// The expiration time is in seconds since the Unix epoch
					throw new Error("Failed to decode");
				}

				const expired_token = decodedToken.exp;
				// Creating refresh token not that expiry of refresh
				//token is greater than the access token

				const refreshToken = utils.auth.generateRefreshToken(user);
				const decodedRefreshToken = jwt.decode(refreshToken);
				if (!decodedRefreshToken) {
					// The expiration time is in seconds since the Unix epoch
					throw new Error("Failed to decode");
				}
				const expired_refresh_token = decodedRefreshToken.exp;

				luckyModel.updateOne(
					COLLECTIONS.USER,
					{ _id: auth._id },
					{ token: accessToken, expired_token: expired_token, refresh_token: refreshToken, expired_refresh_token: expired_refresh_token }
				);
				// Assigning refresh token in http-only cookie
				const result = { error: 0, message: "Success", access_token: accessToken, refresh_token: refreshToken };
				return res.json(result);
			}
		});
	} catch (error) {
		const result = {
			error: 1,
			message: error?.message,
			data: {},
		};
		return utils.common.response(req, res, result);
	}
});

module.exports = user;
