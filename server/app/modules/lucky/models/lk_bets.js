const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		user_id: String,
		username: String,
		user: { type: mongoose.Schema.Types.ObjectId, ref: "lk_users", required: true },
		digit: String,
		amount: { type: Number, default: 0 },
		rate: { type: Number, default: 0 },
		numbers: Object,
		number: String,
		type: { type: Number, default: 0 },
		type_bet: String,
		count: { type: Number, default: 0 },
		totalBet: { type: Number, default: 0 },
		expectedWin: { type: Number, default: 0 },
		checkedItems: { type: Object, default: {} },
		betInfo: { type: Object, default: {} },
		publisher: { type: mongoose.Schema.Types.ObjectId, ref: "lk_publishers", required: true },
		publisher_id: String,
		publisher_name: String,
		publisher_slug: String,
		schedule: { type: mongoose.Schema.Types.ObjectId, ref: "lk_schedules", required: true },
		schedule_id: String,
		date: String,
		month: String,
		year: String,
		level: String,
		is_win: { type: Boolean, default: false },
		profit: { type: Number, default: 0 },
		wins: { type: Object, default: {} },
		resultData: { type: Object, default: {} },
		winCount: { type: Number, default: 0 },
		status: { type: Number, default: 0 },
		ip: String,
		browser: String,
		timestamps: { type: Number, default: 0 },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_bets", objSchema, "lk_bets"); // model name, schema name, collection name
