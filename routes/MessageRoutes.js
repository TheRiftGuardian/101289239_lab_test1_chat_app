const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const GMModel = require('../models/GroupMessage');
const PMModel = require('../models/PrivateMessage');
const app = express();

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.get('/groupMessages', (req, res) => {
	GMModel.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.post('/groupMessages', (req, res) => {
	console.log(req.body);
	const msg = {
		from_user: req.body.from_user,
		room: req.body.room,
		message: req.body.message
	};
	var message = new GMModel(msg);
	message.save((err) => {
		if (err) {
			console.log(err);
		}
	});
});

module.exports = app;
