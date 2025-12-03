const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	name:String,
	description:String,
	date:String,
	periods:String,
	status:String,
	update_by:String
},{timestamps:true});

//Create a model using it
module.exports = mongoose.model('lk_publishers',objSchema,'lk_publishers'); // model name, schema name, collection name
