var express = require('express');
var router = express.Router();
var request = require('request');
var storage = require('node-persist');

router.get('/', function (req, res, next) {

	storage.init().then(function() {
		storage.getItem('token').then(function(value) {
			var accessToken = value;

			// Make a call to youtube search
			var options = {
				url: 'https://www.googleapis.com/youtube/v3/search?part=id&eventType=live&type=video',
				headers: {
					'Authorization': 'Bearer ' + accessToken
				}
			};

			request(options, function(error, response, body) {
				var info = JSON.parse(body);
				var items = info.items;
				res.render('broadcasts', { token: accessToken, json: items });
			});

  			
		});

	});
});

module.exports = router;