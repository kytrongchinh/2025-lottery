const express = require("express");
const { MESSAGES, COLLECTIONS } = require("../../../../configs/constants");
const folkgame = express.Router();
const folkGameModel = require("../../../folkgame/models");
const { getUserInfo } = require("../../../../utils/middleware");
const _ = require("lodash");
const { group } = require("node:console");

function transformByGroup(data) {
	const map = new Map();

	for (const item of data) {
		if (!map.has(item.group)) {
			map.set(item.group, {
				label: item.label,
				description: item.description,
				cols: item.cols,
				items: [],
				group: item?.group
			});
		}

		map.get(item.group).items.push({
			name: item.item_name,
			rate: item.item_rate,
			description: item.item_des,
			type: item.item_type,
		});
	}

	return Array.from(map.values());
}
folkgame.get("/", getUserInfo, async function (req, res) {
	try {
		const rates = await folkGameModel.findAll(COLLECTIONS.FOLKGAME_RATES, { status: 1 }, "", { weight: 1 });
		const data = transformByGroup(rates);

		const result = {
			error: 0,
			message: "Success",
			data: data,
		};

		return utils.common.response(req, res, result);
	} catch (error) {
		const result = {};
		return utils.common.response(req, res, result, 400);
	}
});



module.exports = folkgame;
