
/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	sys = require('sys'),
	events = require('events');

var app = module.exports = express.createServer();

/*
var twitter = require('twitter'),
	OAuth = require('oauth').OAuth;

var consumer_key = 'UWvJ8EeOQvvrGsGXmGMQ',
	consumer_key_secret = 'oNjPgyZDlFcW6lhqZcRdLgs394UlN7BwZLfdHuQ',
	access_token = '',
	access_token_secret = '';

var oa = new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		consumer_key,
		consumer_key_secret,
		"1.0",
		null,
		"HMAC-SHA1"
	),
	e = new events.EventEmitter();

oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	access_token = oauth_token;
	access_token_secret = oauth_token_secret;
	e.emit('twitter_authorized');
});

e.on('twitter_authorized', function(){
	console.log(consumer_key);
	console.log(consumer_key_secret);
	console.log(access_token);
	console.log(access_token_secret);

	var twit = new twitter({
		consumer_key: consumer_key,
		consumer_secret: consumer_key_secret,
		access_token_key: access_token,
		access_token_secret: access_token_secret
	});

	twit.stream('user', { track : 'takyam' }, function(stream){
		stream.on('data', function(data){
			console.log(data);
		});
	});
});

*/

// Configuration
http.get({
	'host' : 'twitter.com',
	'port' : 80,
	'path' : '/statuses/user_timeline/clbot_eew.json?count=5'
}, function(res){
    var body = '';
    res.on('data', function(data) {
        body += data;
    });
    res.on('end', function() {
       JSON.parse(body);
    });
});

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
	res.render('index', {
		title: 'Express'
	});
});

var socket = io.listen(app);


//twitterで@clbot_eewをクロール
//->

//mongooseに格納
//->
//差分があればブロードキャスト
socket.broadcast('hogegege');

// Only listen on $ node app.js

if (!module.parent) {
	app.listen(3000);
	console.log("Express server listening on port %d", app.address().port);
}
