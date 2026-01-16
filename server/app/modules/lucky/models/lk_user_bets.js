const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		user_id: String,
		username: String,
		user: { type: mongoose.Schema.Types.ObjectId, ref: "lk_users", required: true },
		num_bet: { type: Number, default: 0 },
		total_amount: { type: Number, default: 0 },
		profit: { type: Number, default: 0 },
		loss: { type: Number, default: 0 },
		digit_two: { type: Object, default: {} },
		digit_three: { type: Object, default: {} },
		digit_four: { type: Object, default: {} },
		folk_game: { type: Object, default: {} },
		status: { type: Number, default: 0 },
		level: String,
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_user_bets", objSchema, "lk_user_bets"); // model name, schema name, collection name
