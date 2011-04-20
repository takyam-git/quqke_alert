/*
 * loader from amachang's blog >> http://d.hatena.ne.jp/amachang/20071116/1195202294
 */
var host = 'www2133u.sakura.ne.jp',
	ip = '3333',
	fadeout_speed = 1000;

var load = function(src, check, next) {
	check = new Function('return !!(' + check + ')');
	if(!check()){
		var script = document.createElement('script');
		script.src = src;
		//document.head.appendChild(script);
		document.documentElement.getElementsByTagName('HEAD')[0].appendChild(script);




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
	load('http://' + host + ':' + ip + '/socket.io/socket.io.js', 'window.io', function() {
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
			this.alert_box = '<div style="padding:' + this.config.padding.toString() + 'px;color:#fff;font-size:200%;font-weight:bold;background-color:#f00;border:' + this.config.border.toString() + 'px solid #000;position:absolute;top:0;left:0;z-index:9999;text-align:center;display:none;"></div>';
			this.showed = 0;
			this.alert = function(text, url){
				var box = $(parent.alert_box);
				$('body').append(box);
				box.click(function(){
					parent.showed = parent.showed > 0 ? parent.showed - 1 : 0;
					$(this).stop().hide();
				});
				var o = $(document);
				var w = {
					'width'  : o.width() - ( parent.config.border * 2 ) - (parent.config.padding * 2),
					'height' : o.height() - ( parent.config.border * 2 ) - (parent.config.padding * 2)
				};
				parent.showed++;
				box.css({
					'width'       : w.width.toString() + 'px',
					'height'      : w.height.toString() + 'px'
				}).stop().show().css('opacity', '1')
				.html('<p>【緊急地震速報】</p><p>' + text + '</p><p style="margin:20px 0;"><a href="' + url + '" target="_blank">' + url + '</a></p><p style="font-size:50%;"></p>')
				.animate({
					'opacity' : '1'
				},{
					'duration' : fadeout_speed,
					'complete' : function(){
						var opdate = new Date();
						$(this).css({
							'padding'   : '5px 0px',
							'position'  : 'fixed',
							'height'    : '20px',
							'font-size' : '14px',
							'position'  : 'fixed',
							'width'     : $(window).width() - 10,
							'bottom'    : 0 + ((parent.showed-1)*40),
							'top'       : 'auto'
						}).html((box.text().replace('【緊急地震速報】', '').replace(/(http\:\/\/.+?)(\s|$)/, "&nbsp;&nbsp;=>&nbsp;&nbsp;<a style=\"text-decoration:underline;\" href=\"$1\" target=\"_blank\">$1</a>")))
						.hover(function(){
							$(this).css('cursor', 'pointer');
						},function(){
							$(this).css('cursor', 'default');
						});
					}
				});
			};
			
			var socket = new io.Socket(host, {'port' : parseInt(ip)});
			socket.connect();
			socket.on('message', function(data){
				var text = data.replace(/\s?https?\:\/\/.+$/, '').replace(/(震度.+?)\s/, '<span style="font-size:300%;">$1</span>');
				var urlmatch  = data.match(/https?\:\/\/.+/);
				var url = urlmatch != null ? urlmatch[0] : '';
				parent.alert(text, url);
			});
		});
	})(jQuery);
};
