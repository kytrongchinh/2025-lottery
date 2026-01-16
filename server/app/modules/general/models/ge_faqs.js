const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	title: {
		type: Object, default: [
			{ lang: "vn", content: "" }
		]
	},
	desciption: {
		type: Object, default: [
			{ lang: "vn", content: "" }
		]
	},
	content: {
		type: Object, default: [
			{ lang: "vn", content: "" }
		]
	},
	status: { type: Number, default: 0 },
	type: String,
	weight: { type: Number, default: 0 },
	update_by: String
}, { timestamps: true });

//Create a model using it
module.exports = mongoose.model('ge_faqs', objSchema, 'ge_faqs'); // model name, schema name, collection name
