const express = require("express");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const general = express.Router();
const luckyModel = require("../../../lucky/models");
const generalModel = require("../../../general/models");
const { getUserInfo } = require("../../../../utils/middleware");
const _ = require("lodash");



general.get("/faqs", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const conditions = {
			status: 1
		};

		let page = 1;
		if (requestData?.page) page = parseInt(requestData?.page);
		page = page < 1 ? 1 : page;
		const limit = parseInt(requestData?.limit) || 6;
		const skip = limit * (page - 1);
		const sort = {
			createdAt: -1,
		};
		const items = await generalModel.find(COLLECTIONS.GENERAL_FAQS, conditions, "title description content status type", sort, limit, skip);
		const total = await generalModel.count(COLLECTIONS.GENERAL_FAQS, conditions);
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

general.get("/faq", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const id = requestData?.id;

		const conditions = {
			_id: id,
			status: 1
		};

		const item = await generalModel.findOne(COLLECTIONS.GENERAL_FAQS, conditions);
		const result = {
			error: 0,
			message: "Success",
			data: item,
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

general.get("/banners", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);

		const conditions = {
			status: 1
		};
		if (requestData?.position) {
			conditions.position = requestData?.position;
		}

		let page = 1;
		if (requestData?.page) page = parseInt(requestData?.page);
		page = page < 1 ? 1 : page;
		const limit = parseInt(requestData?.limit) || 6;
		const skip = limit * (page - 1);
		const sort = {
			createdAt: -1,
		};
		const items = await generalModel.find(COLLECTIONS.GENERAL_BANNERS, conditions, "title description content status type", sort, limit, skip);
		const total = await generalModel.count(COLLECTIONS.BET, conditions);
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

general.get("/banner", async function (req, res) {
	try {
		const requestData = helpers.admin.filterXSS(req.query);
		const id = requestData?.id;

		const conditions = {
			status: 1
		};
		if (id) {
			conditions._id = id;
		}
		if (requestData?.position) {
			conditions.position = requestData?.position;
		}

		const item = await generalModel.findOne(COLLECTIONS.GENERAL_BANNERS, conditions);
		const result = {
			error: 0,
			message: "Success",
			data: item,
		};
		return utils.common.response(req, res, result);
	} catch (error) {
		console.log(error, "error");
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});

module.exports = general;
