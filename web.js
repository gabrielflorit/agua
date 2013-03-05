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

	webshot('livecoding.io/s/' + gist, gist + '.png', options, function(err) {
		var buf = fs.readFileSync(gist + '.png');

		imageMagick(buf, gist + '.png')
			.resize(320, 240)
			.write(gist + '1.png', function(err) {
					var img = fs.readFileSync(gist + '1.png');
					res.writeHead(200, {'Content-Type': 'image/png' });
					res.end(img, 'binary');
					fs.unlink(gist + '1.png');
					fs.unlink(gist + '.png');
			});

	});

});

app.get('/:gist/:version', function(req, res) {

	var gist = req.params.gist;
	var version = req.params.version;

	webshot('livecoding.io/s/' + gist + '/' + version, gist + '-' + version + '.png', options, function(err) {

		imageMagick(buf, gist + '-' + version + '.png')
			.resize(320, 240)
			.write(gist + '-' + version + '1.png', function(err) {
					var img = fs.readFileSync(gist + '-' + version + '1.png');
					res.writeHead(200, {'Content-Type': 'image/png' });
					res.end(img, 'binary');
					fs.unlink(gist + '-' + version + '1.png');
					fs.unlink(gist + '-' + version + '.png');
			});

	});

});

app.listen(process.env.PORT || 5000);
