const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		name: String,
		publisher_id: String,
		publisher_name: String,
		date: String,
		period: String,
		status: { type: Number, default: 0 },
		results: { type: Object, default: {} },
		win: { type: Object, default: {} },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_schedules", objSchema, "lk_schedules"); // model name, schema name, collection name
