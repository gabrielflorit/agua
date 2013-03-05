var express = require('express');
var app = express();
var fs = require('fs');
var webshot = require('webshot');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });

var options = {
	screenSize: {
		width: 1024,
		height: 768
	},
	showSize: {
		width: 'window',
		height: 'window'
	}
};

app.get('/:gist', function(req, res) {

	var gist = req.params.gist;

	console.log('getting webshot');

	webshot('google.com', 'google.png', options, function(err) {
//	webshot('livecoding.io/s/' + gist, gist + '.png', options, function(err) {
		console.log('got webshot');

		var buf = fs.readFileSync('google.png');	

		imageMagick(buf, 'google.png')
			.resize(100, 100)
			.write('google1.png', function(err) {
				console.log(err);
				// var img = fs.readFileSync('google1.png');

				// res.writeHead(200, {'Content-Type': 'image/png' });
				// res.end(img, 'binary');
				// fs.unlink('google1.png');
				// fs.unlink('google.png');
			});

	});

});

app.get('/:gist/:version', function(req, res) {

	var gist = req.params.gist;
	var version = req.params.version;

	webshot('livecoding.io/s/' + gist + '/' + version, gist + '-' + version + '.png', options, function(err) {

		var img = fs.readFileSync(gist + '-' + version + '.png');
		res.writeHead(200, {'Content-Type': 'image/png' });
		res.end(img, 'binary');
		fs.unlink(gist + '-' + version + '.png');

	});

});

app.listen(process.env.PORT || 5000);
