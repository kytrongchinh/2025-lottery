const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		user_id: String,
		user: { type: mongoose.Schema.Types.ObjectId, ref: "lk_users", required: true },
		num_bet: { type: Number, default: 0 },
		total_amount: { type: Number, default: 0 },
		digit_two: { type: Object, default: {} },
		digit_three: { type: Object, default: {} },
		digit_four: { type: Object, default: {} },
		profit: { type: Number, default: 0 },
		loss: { type: Number, default: 0 },
		status: { type: Number, default: 0 },
		date: String,
		month: String,
		year: String,
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_user_bet_dates", objSchema, "lk_user_bet_dates"); // model name, schema name, collection name
