const mongoose = require('mongoose');

//Create Schema
const GMSchema = new mongoose.Schema({
	from_user: {
		type: String,
		required: true
	},
	room: {
		type: String,
		required: true,
		lowercase: true
	},
	message: {
		type: String,
		required: true,
		trim: true
	},
	date_sent: {
		type: Date,
		default: Date.now
	}
});

//Create Model
const GroupMessage = mongoose.model('GM', GMSchema);
module.exports = GroupMessage;
