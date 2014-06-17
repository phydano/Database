var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
//query = client.query('CREATE TABLE logindatabase (id integer , points integer)');
query = client.query('CREATE TABLE mapsdatabase (title text, description text, longitude decimal(10,8) , latitude decimal(10,8), greenpoints integer)');
query.on('end', function(result) { client.end(); });

