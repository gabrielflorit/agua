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

var processImageWithBuf = function(res, name, buf) {

	imageMagick(buf, name + '.png')
		.resize(320, 240)
		.write(name + '1.png', function(err) {
				var img = fs.readFileSync(name + '1.png');
				res.writeHead(200, {'Content-Type': 'image/png' });
				res.end(img, 'binary');
		});

};

var processImage = function(res, name) {

	var buf = fs.readFileSync(name + '.png');

	processImageWithBuf(res, name, buf);

};

app.get('/:gist', function(req, res) {

	var gist = req.params.gist;
	var name = gist;

	// try to read file first
	fs.readFile(name + '.png', function(err, buf) {

		// if it errors out, assume there's no file
		if (err) {
			webshot('livecoding.io/s/' + gist + '?hideWatermark=True', gist + '.png', options, function(err) {
				if (err) {
					console.log(err);
				} else {
					processImage(res, name);
				}
			});
		} else {
				processImage(res, name, buf);
		}
	});

});

app.get('/:gist/:version', function(req, res) {

	var gist = req.params.gist;
	var version = req.params.version;
	var name = gist + '-' + version;

	// try to read file first
	fs.readFile(name + '.png', function(err, buf) {

		// if it errors out, assume there's no file
		if (err) {
			webshot('livecoding.io/s/' + gist + '/' + version + '?hideWatermark=True', name + '.png', options, function(err) {
				if (err) {
					console.log(err);
				} else {
					processImage(res, name);
				}
			});
		} else {
				processImage(res, name, buf);
		}
	});

});

app.listen(process.env.PORT || 5000);
