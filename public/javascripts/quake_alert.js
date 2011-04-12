/*
 * loader from amachang's blog >> http://d.hatena.ne.jp/amachang/20071116/1195202294
 */
var load = function(src, check, next) {
	check = new Function('return !!(' + check + ')');
	if(!check()){
		var script = document.createElement('script');
		script.src = src;
		document.head.appendChild(script);
		setTimeout(function() {
			if(!check()){
				setTimeout(arguments.callee, 100);
			}else{
				next();
			};
		}, 100);
	}
	else next();
};

window.onload = function(){
	load('http://localhost:3000/socket.io/socket.io.js', 'window.io', function() {
		if(!window.jQuery){
			load('http://code.jquery.com/jquery-latest.js', 'window.jQuery', function() {
				if($ && $!=jQuery){
					jQuery.noConflict();
				}
				quake_alert();
			});
		}else{
			quake_alert();
		}
	});
};

function quake_alert(){
	(function($) { 
		$(function() {
			var parent = this;
			//append alert box to body
			this.config = {
				'border'  : 5,
				'padding' : 40
			};
			this.alert_box = $('<div id="_quake_alert_box" style="padding:' + this.config.padding.toString() + 'px;color:#fff;font-size:200%;font-weight:bold;background-color:#f00;border:' + this.config.border.toString() + 'px solid #000;position:absolute;top:0;left:0;z-index:9999;text-align:center;display:none;"></div>');
			this.alert_box.click(function(){
				$(this).stop().hide();
			});
			$('body').append(this.alert_box);
			this.alert = function(msg, scale){
				var o = $(document);
				var w = {
					'width'  : o.width() - ( parent.config.border * 2 ) - (parent.config.padding * 2),
					'height' : o.height() - ( parent.config.border * 2 ) - (parent.config.padding * 2)
				};
				parent.alert_box.css({
					'width'       : w.width.toString() + 'px',
					'height'      : w.height.toString() + 'px'
				})
				.html('<p>【緊急地震速報】</p><p>震度' + scale + '</p><p style="margin:20px 0;">' + msg + '</p><p style="font-size:50%;"></p>')
				.show().fadeOut(3000);
			};
			
			var socket = new io.Socket('localhost', {'port' : 3000});
			socket.connect();
			socket.on('message', function(data){
				parent.alert(data);
			});
			socket.send('ddd');
		});
	})(jQuery);
};