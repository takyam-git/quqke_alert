/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io'),
	sys = require('sys'),
	http = require('./libs/http-basic-auth'),
	events = require('events'),
	TwitterNode = require('twitter-node').TwitterNode;

var app = module.exports = express.createServer();

// Configuration
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
var twitter = require('twitter'),
	OAuth = require('oauth').OAuth;

var consumer_key = '2MZRf7DdgHNalQB0g6rcmw',
	consumer_key_secret = 'k7LzeFjkNZJixqe3tzQTnVzwtyu26rKMTzMKC02xc',
	//access_token = '283406055-efL6CfkXTA3egwColBalqWIRoFSPZp6QmbKmDWKx',
	//access_token_secret = 'OPuvcmIFghRb2qvh1DnbGJ6cYpPc2NlBungdj5vQ',
	access_token = '',
	access_token_secret = '',
	follow_user_id =283406055;

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

if(access_token == '' || access_token_secret == ''){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		console.log(arguments);
		console.warn('http://twitter.com/oauth/authorize?oauth_token=' + oauth_token + "\n");
		var stdin = process.openStdin();
		console.warn('PIN: ');
		stdin.on('data', function(d) {
			d = (d+'').trim();
			if(!d) {
				console.warn('\nTry again: ');
			}
			console.warn('Received PIN: ' + d);
			oa.getOAuthAccessToken(oauth_token, oauth_token_secret, d, function(error, oauth_access_token, oauth_access_token_secret, results2) {
				console.log(arguments);
				access_token = oauth_access_token;
				access_token_secret = oauth_access_token_secret;
				e.emit('twitter_authorized');
			});
		});
	});
}else{
	e.emit('twitter_authorized');
};

e.on('twitter_authorized', function(){
	var twit = new twitter({
		consumer_key: consumer_key,
		consumer_secret: consumer_key_secret,
		access_token_key: access_token,
		access_token_secret: access_token_secret
	});
	twit.stream('user', {track : 'follow=' + follow_user_id.toString()}, function(stream) {
		stream.on('data', function (data) {
			if(typeof(data)=='object' && data.user){
				if(data.user.screen_name == 'get_jishin_news'){
					console.log('--------------------------------------------');
					console.log('USER_NAME     : ' + data.user.screen_name.toString());
					console.log('USER_ID       : ' + data.user.id.toString());
					console.log('USER_TWEET    : ' + data.text.toString());
					console.log('USER_TWEET_ID : ' + data.id_str.toString());
					console.log('--------------------------------------------');
				};
			}
		});
	});
});
//mongooseに格納
//->
//差分があればブロードキャスト
socket.broadcast('hogegege');

// Only listen on $ node app.js

if (!module.parent) {
	app.listen(3333);
	console.log("Express server listening on port %d", app.address().port);
}
