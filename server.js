const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 3000;

var userRouter = require('./routes/UserRoutes');
var messageRouter = require('./routes/MessageRoutes.js');

// Create Server Side socket
const io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mongodb connection
mongoose
	.connect(
		'mongodb+srv://TheRiftGuardian:S6fdxxikdhRL29K@comp3123.okoru.mongodb.net/test?authSource=admin&replicaSet=atlas-tn0e20-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then((success) => {
		console.log(`MongoDB connected ${success}`);
	})
	.catch((err) => {
		console.log(`Error while MongoDB connection ${err}`);
	});

/*
//Default Express Get
app.get('/', (req, res) => {
	res.send('<h1> Welcome to Socker Programming</h1>');
});

//Get index.html
app.get('/index.html', (req, res) => {
	res.sendFile(__dirname + '/index_copy.html');
});
*/
// Accept client request, Successful Connection, the name socket can be any variable name
io.on('connection', (socket) => {
	console.log(`A NEW user is connected: ${socket.id}`);

	//Send welcome message
	// This is a custom event
	// Syntax is socket.emit('eventName', message)
	// You would have to write the welcome event on the client side (index.html) so the client can read it
	socket.emit('welcome', `Welcome to Chat. Your ID is ${socket.id}`);

	// Disconnect, when you close the tab
	socket.on('disconnect', () => {
		console.log(`${socket.id} Client Disconnected...`);
		const farewellMsg = {
			msg: `User ID: ${socket.id} has left Room`
		};
		console.log(`User ID: ${socket.id} has left Room`);
		socket.broadcast.emit('farewellMsg', farewellMsg);
	});

	// New message coming from the textbox from client
	socket.on('message', (data, username) => {
		// Sends to newMessage event
		// This will send to current client, basically the clients sends to themselves
		//{
		//socket.emit('newMessage', data);
		// }

		// To send to all you would use io first which is the global
		// Creates msg object that contains sender id and the message
		// This is then emitted and formatted through the newMessage client event
		const msg = {
			from_user: username,
			message: data
		};
		// This will send to all the client INCLUDING sender
		// {
		// io.sockets.emit('newMessage', msg);
		// }
		// This will send to all clients excluding the sender
		socket.broadcast.emit('newMessage', msg);
	});

	// Event Join New Room
	socket.on('join', (roomName, username) => {
		// Socket will join room
		socket.join(roomName);
		const msg = {
			from_user: username,
			message: `Joined ${roomName} room successfully`
		};
		// This will send to all client
		// {
		// io.sockets.emit('newMessage', msg);
		// }
		socket.broadcast.to(roomName).emit('newMessage', msg);
	});

	socket.on('typing', (data) => {
		if (data.typing == true) io.emit('display', data);
		else io.emit('display', data);
	});

	socket.on('room_message', (data) => {
		const msg = {
			from_user: data.from_user,
			message: data.message
		};
		// If you provide the socket id this is a 1 to 1 chat.
		// Direct message/1-to-1 message using socket ID
		//socket.broadcast.to(socket.id).emit('message', msg)
		// io.to(socket.id).emit('message', msg)

		// To all client in room
		socket.broadcast.to(data.room).emit('newMessage', msg);
	});
});

app.use(userRouter);
app.use(messageRouter);

//Start HTTP server
http.listen(PORT, () => {
	console.log(`Server running at PORT ${PORT}`);
});
