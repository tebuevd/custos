var express = require('express')
	, path = require('path');

var app = express.createServer(express.logger());

app.configure(function(){
	app.use(express.static(path.join(__dirname + '/assets')));
});

app.get('/', function(request, response) {
  response.sendfile('index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});