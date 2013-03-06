var express = require('express');
var app = express();
var fs = require('fs');
var webshot = require('webshot');
var cloudinary = require('cloudinary');
var http_get = require('http-get');

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

	var cloudinary_options = {width: 180, height: 135};

	var url = cloudinary.url(gist + '.png', cloudinary_options);

	http_get.get({url: url}, null, function (error) {

		if (error) {

			// image doesn't exist - let's create it
			webshot('livecoding.io/s/' + gist + '?hideWatermark=True', gist + '.png', options, function(err) {

				if (err) {
					console.log(err);
				} else {

					console.log('created ' + gist + '.png');

					// upload image
					cloudinary.uploader.upload(gist + '.png', function() {

						console.log('uploaded ' + gist + '.png');

						// return the url
						res.send(cloudinary.url(gist + '.png', cloudinary_options));

					}, {public_id: gist});
				}
			});

		} else {

			// image exists - return the url
			res.send(url);
		}
	});

});

app.listen(process.env.PORT || 5000);
