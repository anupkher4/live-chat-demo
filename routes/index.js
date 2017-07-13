var express = require('express');
var router = express.Router();
var http = require('http');
var querystring = require('querystring');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var storage = require('node-persist');

// https://vast-river-80043.herokuapp.com
// http://localhost:3000/oauth2callback

var oauth2Client = new OAuth2(
  '672840972805-p5qund3ok5jl2jp5poo3s8c3vlkutup4.apps.googleusercontent.com',
  'X9eNLtMMyjI6p-swQuz8Gieb',
  'https://vast-river-80043.herokuapp.com/oauth2callback'
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
