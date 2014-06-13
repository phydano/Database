var express = require('express')
  , app = express()
  , pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , port = process.env.PORT
  , client;
  
client = new pg.Client(connectionString);
client.connect();

app.use(express.bodyParser()); // make express handle JSON and other requests 
app.use(express.static(__dirname)); // serve up the files from this directory 
app.use(app.router); // if not able to serve up a static file try and handle as REST invocation 

app.post('/database', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('points')) {
		res.statusCode = 400;
		return res.send('Error 400: Post Syntax incorrect.');
	}

    var query = client.query("SELECT * FROM logindatabase");

  	query.on('row', function(result, row) {
    	console.log(result);
//    	result.addRow(row);
//    });
//    query.on('end', function(result) {
    	var personId = req.body.id; // get the person's id 
    	var oldPoints = client.query("SELECT points FROM logindatabase WHERE id = $1", [personId]); // the old point the person has 
    //	var oldPointsToInt = parseInt(oldPoints); This cause NAN - error 
    	var newPoints = req.body.points; // the new points given 
    //	var newPointsToInt = parseInt(newPoints); // convert points to integer 
    //	var points = newPoints + oldPoints; // total points 
    	client.query("UPDATE logindatabase SET points = $1 WHERE id = $2", [newPoints, personId]); // update the person's points 
  	});
});

// Get all of the stuff from database 
app.get('/database/get', function(req, res) {

  var query = client.query("SELECT * FROM logindatabase");
  query.on('row', function(row, result) {
    result.addRow(row);
  });
  query.on('end', function(result) {
    // Send JSON back to the client
    res.json(result.rows);
    });
});

app.listen(port, function() {
	console.log('Listening on:', port);
});
