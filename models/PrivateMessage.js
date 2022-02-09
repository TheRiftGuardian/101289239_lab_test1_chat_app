const mongoose = require('mongoose');

//Create Schema
const PMSchema = new mongoose.Schema({
	from_user: {
		type: String,
		required: true
	},
	to_user: {
		type: String,
		required: true
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
const PrivateMessage = mongoose.model('PM', PMSchema);
module.exports = PrivateMessage;
