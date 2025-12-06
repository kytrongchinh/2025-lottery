const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		publisher: { type: mongoose.Schema.Types.ObjectId, ref: "lk_publishers", required: true },
		publisher_id: String,
		publisher_name: String,
		publisher_slug: String,
		date: String,
		month: String,
		year: String,
		digit2: { type: Object, default: [] },
		digit3: { type: Object, default: [] },
		digit4: { type: Object, default: [] },
		status: { type: Number, default: 0 },
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_digits", objSchema, "lk_digits"); // model name, schema name, collection name
