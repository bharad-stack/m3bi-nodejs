var express = require("express"),
	bodyParser = require('body-parser');;
var app = express();

var rooms = [{
		"room_name": "default_room",
		"room_points": 0,
		"status": "booked",
		"booked_user": "default"
	}],
	users = [{
		"user_name": "default",
		"points": 100
	}];


//server start
app.use(bodyParser.json());
app.listen(3000, () => {
	console.log("Server running on port 3000");
});

//add_user
app.post('/add_user', function (request, response) {
	
	if (request.body.user_name == undefined || request.body.points == undefined) {
		response.send("invalid request. use get request /request_types rest point to know the request body details.");
	}
	else {
		for (var i = 0; i < users.length; i++) {
			if (users[i].user_name == request.body.user_name) {
				break;
			}
		}
		if (i < users.length) {
			response.send("userid already exist.");
		} else {
			users[users.length] = request.body;
			console.log(users);
			response.send(users);
		}
	}
});


//add points
app.post('/add_user_points', function (request, response) {
	console.log(request.body.user_name + request.body.points);
	if (request.body.user_name == undefined || request.body.points == undefined) {
		response.send("invalid request. use get request /request_types rest point to know the request body details.");
	} else {
		for (var i = 0; i < users.length; i++) {
			if (users[i].user_name == request.body.user_name) {
				break;
			}
		}
		if (i < users.length) {
			users[i].points += request.body.points;
			//console.log(users);
			response.send(users);
		} else {
			response.send("user_name doesn't exist.");
		}
	}
	//console.log(request.body);      
	//response.send(request.body);   
});


//list users
app.get("/list_users", (req, res, next) => {
	res.json(users);
});

//add rooms
app.post('/add_room', function (request, response) {
	if (request.body.room_name == undefined || request.body.room_points == undefined || request.body.status == undefined || request.body.booked_user == undefined) {
		response.send("invalid request. use  get request /request_types rest point to know the request body details.");
	} else {
		for (var i = 0; i < rooms.length; i++) {
			if (rooms[i].room_name == request.body.room_name) {
				break;
			}
		}
		if (i < rooms.length) {
			response.send("Room already exist.");
		} else {
			rooms[rooms.length] = request.body;
			//console.log(users);
			response.send(rooms);
		}
	}
	//console.log(request.body);     
	//response.send(request.body);    
});

//book room

app.post('/book_room', function (request, response) {
	//console.log(request.body.user_name+request.body.room_name);
	if (request.body.user_name == undefined || request.body.room_name == undefined) {
		response.send("invalid request. use get request /request_types rest point to know the request body details.");
	} else {
		for (var i = 0; i < users.length; i++) {
			console.log(users[i].user_name + request.body.user_name);
			if (users[i].user_name == request.body.user_name) {
				break;
			}
		}
		for (var j = 0; j < rooms.length; j++) {
			//console.log(rooms[j].room_name + request.body.room_name);
			if (rooms[j].room_name == request.body.room_name) {
				break;
			}
		}
		console.log(i, j);
		if (j >rooms.length || i >users.length) {
			response.send("username or roomname not found");
		} else if (rooms[j].room_points > users[i].points || rooms[j].status == "booked") {
			response.send("PENDING APPROVAL");
		} else {
			console.log(users[i].points);
			users[i].points = users[i].points - rooms[j].room_points;
			rooms[j].status = "booked";
			rooms[j].booked_user = users[i].user_name;
			response.send("BOOKED");
		}
	}
	//console.log(request.body);   
	//response.send(request.body);    
});


//list rooms
app.get("/list_rooms", (req, res, next) => {
	res.json(rooms);
});

//request type
app.get('/request_types', function (request, response) {
	var res = '##add_room request type(POST) => {"room_name":"default_room","room_points":0,"status":"booked","booked_user":"default"}  ##add_user request type(POST) =>{"user_name":"a","points": 100}  ##book_room requesttype(POST)=>{"user_name":"name","room_name":"name"} ##list_rooms,list_users(GET)';
	response.json(res); // echo the result back
});