var fs = require('fs');
var http = require('http');
var url = require('url');
var webshot = require('webshot');


http.createServer(function(req, res) {
	var request = url.parse(req.url, true);
	var action = request.pathname;

	webshot('google.com', '/tmp/google.png', function(err) {

		console.log('saved');

		var img = fs.readFile('/tmp/google.png', function);
		res.writeHead(200, {'Content-Type': 'image/gif' });
		res.end(img, 'binary');
		fs.unlink('/tmp/google.png');

	});


}).listen(process.env.PORT || 5000);


// var express = require('express');
// var fs = require('fs');

// var app = express.createServer(express.logger());

// app.get('/', function(request, response) {
// 	response.send('Hello World!');
// });

// var port = process.env.PORT || 5000;
// app.listen(port, function() {
// 	console.log("Listening on " + port);
// });



