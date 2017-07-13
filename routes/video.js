var express = require('express');
var router = express.Router();
var request = require('request');
var storage = require('node-persist');

router.get('/:videoId', function(req, res, next) {
	var videoId = req.params.videoId;


	storage.init().then(function() {
		storage.getItem('token').then(function(value) {
			var accessToken = value;

			// Make a call to get video
			var options = {
				url: 'https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=' + videoId,
				headers: {
					'Authorization': 'Bearer ' + accessToken
				}
			};

			request(options, function(error, response, body) {
				var info = JSON.parse(body);
				var item = info.items[0];
				var liveChatId = item.liveStreamingDetails.activeLiveChatId

				// Make a call to get chat messages
				// https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=Cg0KC3F6TVF6YTh4WkNj&part=snippet

				var newOptions = {
					url: 'https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=' + liveChatId + '&part=snippet',
					headers: {
						'Authorization': 'Bearer ' + accessToken
					}
				};

				request(newOptions, function(error, response, body) {
					var chatInfo = JSON.parse(body);
					var chatItems = chatInfo.items;
					res.render('video', { items: chatItems, chatId: liveChatId });
				});

			});

  			
		});

	});

});

module.exports = router;