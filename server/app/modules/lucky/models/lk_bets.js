const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		user_id: String,
		user: String,
		digit: String,
		amount: { type: Number, default: 0 },
		numbers: String,
		total: { type: Number, default: 0 },
		bet_info: { type: Object, default: {} },
		date: String,
		publisher: String,
		is_win: { type: Boolean, default: false },
		profit: { type: Number, default: 0 },
		status: { type: Number, default: 0 },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_bets", objSchema, "lk_bets"); // model name, schema name, collection name
