const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
// const WEEKDAY = {
// 	SUNDAY: 0,
// 	MONDAY: 1,
// 	TUESDAY: 2,
// 	WEDNESDAY: 3,
// 	THURSDAY: 4,
// 	FRIDAY: 5,
// 	SATURDAY: 6,
// };
const objSchema = new Schema(
	{
		name: String,
		slug: String,
		description: String,
		date: { type: Object, default: [] },
		periods: { type: Object, default: [] },
		status: { type: Number, default: 0 },
		type: { type: Number, default: 0 },
		weight: { type: Number, default: 0 },
		region_name: String,
		region: { type: Number, default: 0 },
		timeClose: { type: String, default: "16:00" },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_publishers", objSchema, "lk_publishers"); // model name, schema name, collection name
