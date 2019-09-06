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

//request type
app.get('/', function (request, response) {
	var res = [{"request_name":"addroom",
	"url":"http://localhost:3000/add_room",
	"request_type":"POST",
	"request_format":{"room_name":"default_room","room_points":0,"status":"booked","booked_user":"name"}},
	{"request_name":"adduser",
	"url": "http://localhost:3000/add_user",
	"request_type":"POST",
	"request_format":{"user_name":"name","points": 100}},
	{"request_name":"bookroom",
	"url":"http://localhost:3000/book_room",
	"request_type":"POST",
	"request_format":{"user_name":"name","room_name":"name"}},
	{"request_name":"adduserpoints",
	"url":"http://localhost:3000/add_user_points",
	"request_type":"POST",
	"request_format":{"user_name":"name","points": 100}},
	{"request_name":"listrooms",
	"request_type":"GET",
	"url":"http://localhost:3000/list_rooms"},
	{"request_name":"listusers",
	"request_type":"GET",
	"url":"http://localhost:3000/list_users"}]
	response.json(res); // echo the result back
});

//add_user
app.post('/add_user', function (request, response) {
	
	if (request.body.user_name == undefined || request.body.points == undefined) {
		response.send("invalid request. use get request http://$ipaddress:3000/ rest point to know the request body details.");
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
			//console.log(users);
			response.send(users);
		}
	}
});


//add points
app.post('/add_user_points', function (request, response) {
	//console.log(request.body.user_name + request.body.points);
	if (request.body.user_name == undefined || request.body.points == undefined) {
		response.send("invalid request. use get request http://$ipaddress:3000/ rest point to know the request body details.");
	} else {
		for (var i = 0; i < users.length; i++) {
			if (users[i].user_name == request.body.user_name) {
				break;
			}
		}
		if (i < users.length) {
			users[i].points += request.body.points;
			response.send(users);
		} else {
			response.send("user_name doesn't exist.");
		}
	}
	 
});


//list users
app.get("/list_users", (req, res, next) => {
	res.json(users);
});

//add rooms
app.post('/add_room', function (request, response) {
	if (request.body.room_name == undefined || request.body.room_points == undefined || request.body.status == undefined || request.body.booked_user == undefined) {
		response.send("invalid request. use  get request http://$ipaddress:3000/ rest point to know the request body details.");
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
			response.send(rooms);
		}
	}
 
});

//book room

app.post('/book_room', function (request, response) {
	
	if (request.body.user_name == undefined || request.body.room_name == undefined) {
		response.send("invalid request. use get request http://$ipaddress:3000/ rest point to know the request body details.");
	} else {
		for (var i = 0; i < users.length; i++) {
			//console.log(users[i].user_name + request.body.user_name);
			if (users[i].user_name == request.body.user_name) {
				break;
			}
		}
		for (var j = 0; j < rooms.length; j++) {
			
			if (rooms[j].room_name == request.body.room_name) {
				break;
			}
		}
		//console.log(i, j);
		if (j >rooms.length || i >users.length) {
			response.send("username or roomname not found");
		} else if (rooms[j].room_points > users[i].points || rooms[j].status == "booked") {
			response.send("PENDING APPROVAL");
		} else {
			users[i].points = users[i].points - rooms[j].room_points;
			rooms[j].status = "booked";
			rooms[j].booked_user = users[i].user_name;
			response.send("BOOKED");
		}
	}
	 
});


//list rooms
app.get("/list_rooms", (req, res, next) => {
	res.json(rooms);
});

