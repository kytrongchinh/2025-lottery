const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const objSchema = new Schema({
	user_id: String,
	username: String,
	uid: String,
	folk_id: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: "lk_users", required: true },
	amount: { type: Number, default: 0 },
	selected: Object,
	count: { type: Number, default: 0 },
	totalBet: { type: Number, default: 0 },
	expectedWin: { type: Number, default: 0 },
	checkedItems: { type: Object, default: {} },
	betInfo: { type: Object, default: {} },
	publisher: { type: mongoose.Schema.Types.ObjectId, ref: "lk_publishers", required: true },
	publisher_id: String,
	publisher_name: String,
	publisher_slug: String,
	schedule: { type: mongoose.Schema.Types.ObjectId, ref: "lk_schedules", required: true },
	schedule_id: String,
	date_schedule: String,
	date: String,
	month: String,
	year: String,
	level: String,
	is_win: { type: Boolean, default: false },
	profit: { type: Number, default: 0 },
	wins: { type: Object, default: {} },
	resultData: { type: Object, default: {} },
	winCount: { type: Number, default: 0 },
	status: { type: Number, default: 0 },
	ip: String,
	browser: String,
	timestamps: { type: Number, default: 0 },
	update_by: String
}, { timestamps: true });

//Create a model using it
module.exports = mongoose.model('folkgame_bets', objSchema, 'folkgame_bets'); // model name, schema name, collection name
