
/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	sys = require('sys'),
	events = require('events');

var app = module.exports = express.createServer();

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
