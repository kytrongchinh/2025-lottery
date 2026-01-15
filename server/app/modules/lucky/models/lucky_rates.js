const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		name: String,
		description: String,
		rate: { type: Number, default: 0 },
		rate_3: { type: Number, default: 0 },
		rate_4: { type: Number, default: 0 },
		level: String,
		level_value: { type: Number, default: 0 },
		uid: String,
		date: String,
		type: String,
		status: { type: Number, default: 0 },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lucky_rates", objSchema, "lucky_rates"); // model name, schema name, collection name
