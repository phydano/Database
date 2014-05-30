var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE mydatabase (user text , comment text)');
query.on('end', function(result) { client.end(); });

