const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		name: String,
		publisher: { type: mongoose.Schema.Types.ObjectId, ref: "lk_publishers", required: true },
		publisher_id: String,
		publisher_name: String,
		publisher_slug: String,
		date: String,
		month: String,
		year: String,
		g8: { type: Object, default: [] },
		g7: { type: Object, default: [] },
		g6: { type: Object, default: [] },
		g5: { type: Object, default: [] },
		g4: { type: Object, default: [] },
		g3: { type: Object, default: [] },
		g2: { type: Object, default: [] },
		g1: { type: Object, default: [] },
		gdb: { type: Object, default: [] },
		period: { type: Number, default: 0 },
		day: String,
		status: { type: Number, default: 0 },
		results: { type: Object, default: {} },
		win: { type: Object, default: {} },
		digit2: { type: Object, default: {} },
		digit3: { type: Object, default: {} },
		digit4: { type: Object, default: {} },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_schedules", objSchema, "lk_schedules"); // model name, schema name, collection name
