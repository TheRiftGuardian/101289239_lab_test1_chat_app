const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const userModel = require('../models/User');
const app = express();

//READ ALLL
app.get('/users', async (req, res) => {
	const users = await userModel.find({});
	try {
		res.status(200).send(users);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get('/register', async (req, res) => {
	res.sendFile(__dirname + '/templates/register.html');
});

// Post New Record
app.post('/register', async (req, res) => {
	console.log(req.body);
	const user = new userModel(req.body);

	try {
		await user.save((err) => {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				console.log('redirecting');
				// Redirect to login
				res.sendFile(__dirname + '/templates/login.html');
			}
		});
	} catch (err) {
		console.log("didn't work error");
		res.status(500).send(err);
	}
	res.sendFile(__dirname + '/templates/login.html');
});
// Login
app.get([ '/', '/login' ], async (req, res) => {
	res.sendFile(__dirname + '/templates/login.html');
});

// Submit Login
app.post('/login', async (req, res) => {
	const user = await userModel.findOne({ username: req.body.username, password: req.body.password });
	try {
		if (user == null) {
			res.send(JSON.stringify({ message: 'No user found with those credentials' }));
		} else {
			res.cookie('username', user.username);
			res.sendFile(__dirname + '/templates/index.html');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

// Logout
app.get('/logout', async (req, res) => {
	res.clearCookie('username');
	res.sendFile(__dirname + '/templates/login.html');
});

module.exports = app;
