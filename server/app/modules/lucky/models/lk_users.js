const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema(
	{
		username: String,
		password: String,
		name: String,
		uid: String,
		avatar: String,
		description: String,
		token: String,
		expired_token: String,
		refresh_token: String,
		expired_refresh_token: String,
		status: { type: Number, default: 0 },
		type: String,
		group: String,
		level: String,
		update_by: String,
	},
	{ timestamps: true }
);

//Create a model using it
module.exports = mongoose.model("lk_users", objSchema, "lk_users"); // model name, schema name, collection name
