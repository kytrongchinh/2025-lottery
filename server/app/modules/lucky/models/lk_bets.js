const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	user_id:String,
	user:String,
	digit:String,
	amount:String,
	numbers:String,
	total:String,
	bet_info:String,
	date:String,
	publisher:String,
	is_win:String,
	profit:String,
	status:String,
	update_by:String
},{timestamps:true});

//Create a model using it
module.exports = mongoose.model('lk_bets',objSchema,'lk_bets'); // model name, schema name, collection name
