const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	publisher_id: String,
	publisher: { type: mongoose.Schema.Types.ObjectId, ref: "lk_publishers", required: true },
	num_bet: { type: Number, default: 0 },
	num_user: { type: Number, default: 0 },
	total_amount: { type: Number, default: 0 },
	digit_two: { type: Object, default: {} },
	digit_three: { type: Object, default: {} },
	digit_four: { type: Object, default: {} },
	profit: { type: Number, default: 0 },
	loss: { type: Number, default: 0 },
	status: { type: Number, default: 0 },
	update_by: String
}, { timestamps: true });

//Create a model using it
module.exports = mongoose.model('lk_publisher_bets', objSchema, 'lk_publisher_bets'); // model name, schema name, collection name
