const mongoose = require('mongoose');

//Create Schema
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [ true, 'Please Enter User Name' ],
		trim: true,
		unique: true
	},
	firstname: {
		type: String,
		required: [ true, 'Please Enter First Name' ],
		trim: true,
		lowercase: true
	},
	lastname: {
		type: String,
		alias: 'surname',
		required: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	createon: {
		type: Date,
		default: Date.now
	}
});

//Create Model
const User = mongoose.model('User', UserSchema);
module.exports = User;
