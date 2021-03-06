var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var PORT = 3333;
var API_FILE = 'results.json';

// serve static content from the root folder
app.use(express.static(__dirname));
app.use(express.bodyParser());
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

// JSON endpoint
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

// Fake save endpoint
app.post('/save', function(req, res) {
  console.log('SAVED: show_id: ' + req.body.show_id + ', region_id: ' + req.body.region_id);
  
  // simulate a save
  setTimeout((function() {
    res.header('Content-Type', 'application/json');
    res.send({msg: 'Your selections have been saved.'});
  }), 1000);
});

app.listen(PORT);
console.log("Server listening on port %d in %s mode", PORT, app.settings.env);