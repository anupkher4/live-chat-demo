var express = require('express');
var router = express.Router();
var http = require('http');
var querystring = require('querystring');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var storage = require('node-persist');

var oauth2Client = new OAuth2(
  '672840972805-p5qund3ok5jl2jp5poo3s8c3vlkutup4.apps.googleusercontent.com',
  'X9eNLtMMyjI6p-swQuz8Gieb',
  'http://localhost:3000/oauth2callback'
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/youtube'
];

var clientId = "672840972805-p5qund3ok5jl2jp5poo3s8c3vlkutup4.apps.googleusercontent.com";
var callbackUrl = "http://localhost:3000/oauth2callback";
var oauthurl = "http://accounts.google.com/o/oauth2/auth?client_id=" + clientId + "&redirect_uri=" + encodeURI(callbackUrl) + "&scope=https://www.googleapis.com/auth/youtube&response_type=code&access_type=offline";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'YouTube Live Chat Demo', oauth2url: oauthurl });
});

// Handle OAuth2 callback
router.get('/oauth2callback', function(req, res, next) {
	let authCode = req.query.code
	console.log(`Callback code ${authCode}`);

	// const postData = querystring.stringify({
	// 	client_id: "672840972805-p5qund3ok5jl2jp5poo3s8c3vlkutup4.apps.googleusercontent.com",
	// 	client_secret: 'X9eNLtMMyjI6p-swQuz8Gieb',
	// 	code: authCode,
	// 	redirect_uri: "http://localhost:3000/oauth2callback",
	// 	grant_type: 'authorization_code'
	// });

	// const options = {
	// 	hostname: 'www.googleapis.com',
	// 	path: '/oauth2/v4/token',
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/x-www-form-urlencoded',
	// 		'Content-Length': Buffer.byteLength(postData)
	// 	}
	// };

	// const request = http.request(options, function(response) {
	// 	console.log(`STATUS: ${response.statusCode}`);
	// 	console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
	// 	response.setEncoding('utf8');
	// 	response.on('data', function(data) {
	// 		console.log(`BODY: ${data}`);
	// 	});
	// 	response.on('end', function() {
	// 		console.log('No more data in response.');
	// 	});
	// });

	// request.on('error', function(e) {
	// 	console.error(`problem with request: ${e.message}`);
	// });

	// request.end();

	oauth2Client.getToken(authCode, function(err, tokens) {
		if (!err) {
			console.log(`Access tokens: ${tokens.toString()}`);
			console.log(`${tokens.access_token}`);

			// Initialize storage
			storage.init().then(function() {
				storage.setItem('token', tokens.access_token).then(function() {
					console.log("Token stored");
					res.redirect(301, '/broadcasts');
				});
			});
		}
	});

});

// OAuth flow
function startOAuth() {
	console.log("startOAuth clicked");
	window.location.href = oauthurl;
}

module.exports = router;
