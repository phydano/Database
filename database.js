var express = require('express')
  , app = express()
  , pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , port = process.env.PORT
  , client;
client = new pg.Client(connectionString);
client.connect();
var database = [
	{ user : 'This is the user', text : "This is the comment that users input" }
];

app.use(express.bodyParser()); // make express handle JSON and other requests 
app.use(express.static(_dirname)); // serve up the files from this directory 
app.use(app.router); // if not able to serve up a static file try and handle as REST invocation 

app.post('/database', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('user') || !req.body.hasOwnProperty('text')) {
		res.statusCode = 400;
		return res.send('Error 400: Post Syntax incorrect.');
	}
	var newComment = { user: req.body.user, text: req.body.text };
	
	database.push(newComment);
	console.log("Added!");
	newComment.pos = database.length - 1;
	client.query("INSERT INTO Mydatabase(name, comment) VALUES('req.body.user', 'req.body.text')");
	res.send(newComment);
});

app.listen(port, function() {
	console.log('Listening on:', port);
});
