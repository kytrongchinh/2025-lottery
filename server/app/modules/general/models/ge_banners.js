const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	name: String,
	description: String,
	content: String,
	image: String,
	status: { type: Number, default: 0 },
	weight: { type: Number, default: 0 },
	position: String,
	update_by: String
}, { timestamps: true });

//Create a model using it
module.exports = mongoose.model('ge_banners', objSchema, 'ge_banners'); // model name, schema name, collection name
