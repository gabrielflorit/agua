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

var processImage = function(res, name) {

	var buf = fs.readFileSync(name + '.png');

	imageMagick(buf, name + '.png')
		.resize(320, 240)
		.write(name + '1.png', function(err) {
				var img = fs.readFileSync(name + '1.png');
				res.writeHead(200, {'Content-Type': 'image/png' });
				res.end(img, 'binary');
				fs.unlink(name + '1.png');
				fs.unlink(name + '.png');
		});

};

app.get('/:gist', function(req, res) {

	var gist = req.params.gist;
	var name = gist;

	webshot('livecoding.io/s/' + gist, gist + '.png', options, function(err) {
		processImage(res, name);
	});

});

app.get('/:gist/:version', function(req, res) {

	var gist = req.params.gist;
	var version = req.params.version;
	var name = gist + '-' + version;

	webshot('livecoding.io/s/' + gist + '/' + version, name + '.png', options, function(err) {
		processImage(res, name);
	});

});

app.listen(process.env.PORT || 5000);
