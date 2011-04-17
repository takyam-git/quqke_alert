
/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	sys = require('sys'),
	twitter = require('twitter'),
	OAuth = require('oauth').OAuth;



var consumer_key = 'GjtP71zfaEUcZlbuh1onPA',
	consumer_key_secret = 'WtxItF1bBNmCpQlMb1idHgRJ6UvyKf32VyZsNPjcg4s';

var app = module.exports = express.createServer();
var twit,
	oa = new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		consumer_key,
		consumer_key_secret,
		"1.0",
		null,
		"HMAC-SHA1"
	);

oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
	if(error){
		sys.puts('error :' + error);
	}else {
		sys.puts('oauth_token :' + oauth_token);
	};

	sys.puts('oauth_token_secret :' + oauth_token_secret);
	sys.puts('requestoken results :' + sys.inspect(results));
	sys.puts("Requesting access token");
	oa.getOAuthAccessToken(oauth_token, oauth_token_secret, function(error, oauth_access_token, oauth_access_token_secret, results2) {
		sys.puts('oauth_access_token :' + oauth_access_token);
		sys.puts('oauth_token_secret :' + oauth_access_token_secret);
		sys.puts('accesstoken results :' + sys.inspect(results2));
		sys.puts("Requesting access token");
		var data= "";
		oa.getProtectedResource("http://term.ie/oauth/example/echo_api.php?foo=bar&too=roo", "GET", oauth_access_token, oauth_access_token_secret,  function (error, data, response) {
			sys.puts(data);
		});
	});
});

console.log(twit);
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

//mongooseに格納
//->
//差分があればブロードキャスト
socket.broadcast('hogegege');

// Only listen on $ node app.js

if (!module.parent) {
	app.listen(3000);
	console.log("Express server listening on port %d", app.address().port);
}
