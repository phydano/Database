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

/* UPDATE THE GREEN POINTS OF THE USERS */
app.post('/database', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('points')) {
		res.statusCode = 400;
		return res.send('Error 400: Post Syntax incorrect.');
	}
    var query = client.query("SELECT * FROM logindatabase");

  	query.on('row', function(result, row) {
    	console.log(result);
    	var personId = req.body.id; // get the person's id 
    	var newPoints = req.body.points; // the new points given 
    	client.query("UPDATE logindatabase SET points = $1 WHERE id = $2", [newPoints, personId]); // update the person's points 
  	});
});

/* INSERT EVENTS INTO THE DATABASE */
app.post('/maps', function(req, res) {
	console.log(req.body);
	// This just checks if the title fileds and the description fields are empty. 
	if(!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('description')) {
		res.statusCode = 400;
		return res.send('Error 400: Post Syntax incorrect.');
	}
	// We insert the events into the database 
    client.query("INSERT INTO mapsdatabase2 (title, description, longitude, latitude, greenpoints) VALUES ($1, $2, $3, $4, $5)", [req.body.title, req.body.description, req.body.longitude, req.body.latitude, req.body.greenpoints]);
});

/* [ DELETE DOES NOT WORK ] 
app.post('/remove', function(req, res) {
	console.log(req.body);
	if(!req.body.hasOwnProperty('greenpoints')) {
		res.statusCode = 400;
		return res.send('Error 400: Post Syntax incorrect.');
	}
    client.query("DELETE FROM mapsdatabase2 WHERE title = $1", [req.body.greenpoints]);
});
*/

/* GET ALL STUFF FROM THE LOGIN DATABASE */
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

/* GET ALL STUFF FROM MAP DATABASE */
app.get('/maps/get', function(req, res) {
  var query = client.query("SELECT * FROM mapsdatabase2");
  query.on('row', function(row, result) {
    result.addRow(row);
  });
  query.on('end', function(result) {
    // Send JSON back to the client
    res.json(result.rows);
    });
});

/* LISTEN TO THE PORT */
app.listen(port, function() {
	console.log('Listening on:', port);
});
