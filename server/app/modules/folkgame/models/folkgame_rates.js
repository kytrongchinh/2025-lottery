const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	label: String,
	description: String,
	cols: { type: Number, default: 0 },
	item_name: String,
	item_type: String,
	item_rate: { type: Number, default: 0 },
	item_des: String,
	group: String,
	status: { type: Number, default: 0 },
	weight: { type: Number, default: 0 },
	update_by: String
}, { timestamps: true });

//Create a model using it
module.exports = mongoose.model('folkgame_rates', objSchema, 'folkgame_rates'); // model name, schema name, collection name
