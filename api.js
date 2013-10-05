var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var PORT = 3333;
var API_FILE = 'results.json';

// serve static content from the root folder
app.use(express.static(__dirname));
app.enable('jsonp callback');

// set some generic headers
var headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  //'Content-Type': 'application/json'
  'Content-Type': 'application/javascript'
};

app.get('/api', function(req, res) {
  res.set(headers);
  fs.readFile(path.join(__dirname, API_FILE), 'utf8', function(err, file) {
    if( err ){
      throw(err);
    }
    else {
      res.send(req.query.callback + '(' + JSON.stringify(file) + ')');
    }
  });
});

app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);