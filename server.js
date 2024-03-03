require("dotenv").config();

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = [];

const express = require("express");
const expressWinston = require('express-winston');
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");

const db = require("./app/models");
const limiter = require("./app/middlewares/rateLimiter");
const { transports, format } = require("winston");
const Role = db.role;
const User = db.user.User;

// db.sequelize
// 	.sync()
// 	.then(() => {
// 		console.log("Synced db.");
// 		// initial();
// 	})
// 	.catch((err) => {
// 		console.log("Failed to sync db: " + err.message);
// 	});

function initial() {
	Role.create({
		id: 1,
		name: "user",
	});

	Role.create({
		id: 2,
		name: "moderator",
	});

	Role.create({
		id: 3,
		name: "admin",
	});
}

const app = express();

const port = process.env.PORT;

const corsOptions = {
	origin: `http://localhost:${port}`,
};

app.use(expressWinston.logger({
	transports:[
		new transports.Console(),
		new transports.File({
			level:'warn ',
			filename:'logsWarning.log'
		}),
		new transports.File({
			level:'error',
			filename:'logsError.log'
		})
	],
	format:format.combine(
		format.json(),
		format.prettyPrint(),
		format.timestamp()
	),
	statusLevels:true
}));

app.use(expressWinston.errorLogger({
	transports:[
		new transports.File({
			filename:'logsInternalErrors.log'
		}),
	],
	format:format.timestamp()
}));

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(limiter);
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`User connected ${socket.id}`);

	// We can write our socket event listeners in here...
	socket.on("join_room", (data) => {
		const { username, room } = data; // Data sent from client when join_room event emitted
		socket.join(room); // Join the user to a socket room

		let __createdtime__ = Date.now();
		socket.to(room).emit("receive_message", {
			message: `${username} has joined the chat room`,
			username: CHAT_BOT,
			__createdtime__,
		});

		socket.emit("receive_message", {
			message: `Welcome ${username}`,
			username: CHAT_BOT,
			__createdtime__,
		});

    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);
    
	});
});

User.belongsToMany(Role, { through: "userRole" });
Role.belongsToMany(User, { through: "userRole" });

require("./app/routes/turorial.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/dns.routes")(app);

app.get('/error', (req, res) => {
	throw new Error('This is a custom error');
})

app.get('/test', (req, res) => {
	res.send({message:'This is test  message'});
});

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to NodeJs application");
});

server.listen(port, () => {
	console.log(
		`Server is running on port ${port}. Access it at http://localhost:${port}`,
	);
});
