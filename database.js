var express = require('express')
  , app = express()
  , pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , port = process.env.PORT
  , client;
  
client = new pg.Client(connectionString);
client.connect();
var database = [
	{ person : 'This is the person', comment : "This is the comment that persons input" }
];

app.use(express.bodyParser()); // make express handle JSON and other requests 
app.use(express.static(__dirname)); // serve up the files from this directory 
app.use(app.router); // if not able to serve up a static file try and handle as REST invocation 

app.post('/database', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('person') || !req.body.hasOwnProperty('comment')) {
		res.statusCode = 400;
		return res.send('Error 400: Post Syntax incorrect.');
	}

	client.query("INSERT INTO mydatabase (person, comment) VALUES ($1, $2)", [req.body.person, req.body.comment]);

  	query = client.query("SELECT * FROM mydatabase");

  	query.on('row', function(result) {
    	console.log(result);

    	if (!result) {
      		return res.send('No data found');
    	} else {
      		res.json(result);
    	}
  	});
});

app.listen(port, function() {
	console.log('Listening on:', port);
});
