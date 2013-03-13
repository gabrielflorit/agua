var express = require('express');
var app = express();
app.enable('jsonp callback');
var fs = require('fs');
var webshot = require('webshot');
var cloudinary = require('cloudinary');
var http_get = require('http-get');

var options = {
	screenSize: {
		width: 1024,
		height: 768
	}
};

app.get('/:gist/:time', function(req, res) {

	var gist = req.params.gist;
	var time = req.params.time;
	var name = [gist, time].join('');
	var nameAndType = name + '.png';

	var cloudinary_options = {width: 180, height: 135};

	var url = cloudinary.url(nameAndType, cloudinary_options);

	http_get.get({url: url}, null, function (error) {

		if (error) {

			// image doesn't exist - let's create it
			webshot('livecoding.io/s/' + gist + '?hideWatermark=True', nameAndType, options, function(err) {

				if (err) {
					console.log(err);
				} else {

					console.log('created ' + nameAndType);

					// upload image
					cloudinary.uploader.upload(nameAndType, function() {

						console.log('uploaded ' + nameAndType);

						// return the url
						res.jsonp({url: cloudinary.url(nameAndType, cloudinary_options), gist: gist});

					}, {public_id: name});
				}
			});

		} else {

			// image exists - return the url
			res.jsonp({url: url, gist: gist});
		}
	});

});

app.listen(process.env.PORT || 5000);
