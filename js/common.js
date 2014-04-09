// =========================================================
//
//	common.js
//	全ページ共通で利用するjavascriptを記載
//
// =========================================================

// ===============================================
//
//	グローバル変数
// -----------------------------------------------
var	glbl = {};

glbl.win = {};
glbl.win.elm = $(window);
glbl.win.w = glbl.win.elm.width();
glbl.win.h = glbl.win.elm.height();
glbl.win.size_get = function(){
	glbl.win.w = glbl.win.elm.width();
	glbl.win.h = glbl.win.elm.height();
};
glbl.body = {};
glbl.ua = {
	value : navigator.userAgent,
	os : ''
};
if( glbl.ua.value.indexOf("iPhone") > 0 || glbl.ua.value.indexOf("iPod") > 0 ){
	glbl.ua.os = 'ios';
} else if( glbl.ua.value.indexOf("Android") > 0 ) {
	glbl.ua.os = 'android';
}

// ===============================================
//
//	リセットjs読み込み
// -----------------------------------------------
var load_css = function(){
	var head = document.getElementsByTagName('head')[0],
	    link = document.createElement('link');

	link.href = 'css/recet_js.css';
	link.rel = 'stylesheet';
	head.appendChild(link);
};
//load_css();

//==================================================
//
//	マウスオン
//==================================================

//	透過
//----------------------------------------
$.fn.hover_fade = function(option){
	$(this).each(function(){
		var	elm = $(this),
			opt = $.extend({
				spd : 100,
				opc : 0.6,
				eas : 'linear'
			}, option);

		elm.on({
			'mouseenter.hover_fade' : function(){
				if( glbl.ua.os == 'ios' || glbl.ua.os == 'android' ){ return; }
				elm.stop().animate({
					opacity : opt.opc
				}, opt.spd, opt.eas);
			},
			'mouseleave.hover_fade' : function(){
				if( glbl.ua.os == 'ios' || glbl.ua.os == 'android' ){ return; }
				elm.stop().animate({
					opacity : 1
				}, opt.spd, opt.eas);
			}
		})
	});
};

//	画像パス変更
//----------------------------------------
$.fn.hover_image = function(option){
	$(this).each(function(){
		var	elm = $(this);

		elm.on({
			'mouseenter.hover_image' : function(){
				if( glbl.ua.os == 'ios' || glbl.ua.os == 'android' ){ return; }
				elm.attr('src', elm.attr('src').replace(/^(.+)(\..+)$/,'$1_ov$2'));
			},
			'mouseleave.hover_image' : function(){
				if( glbl.ua.os == 'ios' || glbl.ua.os == 'android' ){ return; }
				elm.attr('src', elm.attr('src').replace(/^(.+)_ov(\..+)$/, '$1$2'));
			}
		})
	});
};

//==================================================
//
//	スムーススクロール
//==================================================
$.fn.smooth_scroll = function(option){
	$(this).each(function(){
		var btn = $(this),
			opt = $.extend({
				speed : 500,
				easing : 'liner'
			}, option);

		btn.on({
			'click.smooth_scroll' : function(){
				if( glbl.body.scroll_now === false ){
					var	hash = $(this.hash),
						hash_offset = $(hash).offset().top;

					glbl.body.scroll_now = true;
					
					$('html, body').stop().animate({
						scrollTop: hash_offset
					}, opt.speed, opt.easing, function(){
						glbl.body.scroll_now = false;
					});
					
					return false;
				} else {
					return false;
				}
			}
		});
	});
};

// ===============================================
//
//	ポップアップ
// -----------------------------------------------
$.fn.popup_win = function(option){
	$(this).each(function(i){
		var elm = $(this),
			opt = $.extend({
				url : elm.attr('href'),
				name : elm.attr('title'),
				width : 600,
				height : 480,
				status : 'no',
				scrollbars : 'no',
				directories : 'no',
				menubar : 'no',
				resizable : 'no',
				toolbar : 'no'
			}, option),
			features = '';

		if( !opt.url ){
			return;
		}
		
		features += 'width=' + opt.width + ',';
		features += 'height=' + opt.height + ',';
		features += 'status=' + opt.status + ',';
		features += 'scrollbars=' + opt.scrollbars + ',';
		features += 'directories=' + opt.directories + ',';
		features += 'menubar=' + opt.menubar + ',';
		features += 'resizable=' + opt.resizable + ',';
		features += 'toolbar=' + opt.toolbar;

		elm.on('click.popup', function() {
			if( glbl.win.w <= 480 ){ return; }
			window.open(opt.url, opt.name, features);
			return false;
		});
	});
};

//==================================================
//
//	フローティング・ウインドウ
//==================================================
$.fn.floating_window = function(option){
	$(this).each(function(){
		var	btn = $(this),
			box_html = '',
			file = $(this).attr('href'),
			noscroll_cls = 'no_scroll',
			top_when_win_open = 0,
			opt = $.extend({
				win_w : 720,
				win_h : 405,
				spd : 250
			}, option);

		// ウインドウのベースになるhtmlを設定
		box_html += '<div id="FloatingWindow">';
		box_html += '<div id="FloatingWindowInner">';
		box_html += '<div id="FloatingBody">';
		box_html += '<div id="FloatingBodyInner">';
		box_html += '<div id="FloatingContents"></div>';
		box_html += '<div id="FloatingClose"><img src="img/share/flt_cls.png" alt="CLOSE"></div>';
		box_html += '</div>';
		box_html += '</div>';
		box_html += '</div>';
		box_html += '<div id="FloatingBack"></div>';
		box_html += '</div>';

		// ファイルのタイプを確認
		var check_filetype_youtube = function(value){
			if( value.indexOf('https://www.youtube.com/') > -1 ){
				return true;
			} else {
				return false;
			}
		};

		var check_filetype_image = function(value){
			var value_split = value.split('.'),
				ext = value_split[value_split.length - 1];

			switch( ext.toLowerCase() ){
				case 'jpeg' :
				case 'jpg' :
				case 'bmp' :
				case 'png' :
				case 'gif' : return true;
				return false;
			}
		};

		// ファイルタイプに合わせてコンテンツを生成
		var contents_build = function(){
			if( check_filetype_youtube(file) === true ){
				var contents = '';
				contents += '<iframe src="//www.youtube.com/embed/';
				contents += file.replace('https://www.youtube.com/watch?v=','');
				contents += '?autoplay=1';
				contents += '&rel=0';
				contents += '" width="';
				contents += opt.win_w;
				contents += '" height="'
				contents += opt.win_h;
				contents += '" frameborder="0" allowfullscreen></iframe>';

				floating_window_open(contents);
			} else if( check_filetype_image(file) === true ){
				var img = new Image(),
					contents = '';

				img.onload = function(){
					opt.win_w = img.width;
					opt.win_h = img.height;
					contents = '<img src=' + file + ' width="' + opt.win_w + '" height="' + opt.win_h + '" alt="">';

					floating_window_open(contents);
				};
				img.src = file;
			}
		};

		// ウィンドウを開く際の動作
		var floating_window_open = function(contents){
			scroll_off();

			glbl.body.elm.append(box_html);

			$('#FloatingWindow').fadeIn(opt.spd, function(){
				$('#FloatingBodyInner').stop().animate({
					width : opt.win_w,
					height : opt.win_h,
					marginLeft : opt.win_w / 2 * -1,
					marginTop : opt.win_h / 2 * -1
				}, 250, function(){
					$('#FloatingContents').append(contents);
					$('#FloatingClose').fadeIn(opt.spd);
				});
			});

			$('#FloatingClose').on({
				'click.floating_window' : function(){
					floating_window_close();
				}
			});

			$('#FloatingBack').on({
				'click.floating_window' : function(){
					floating_window_close();
				}
			});
		};

		// ウィンドウを閉じる際の動作
		var floating_window_close = function(){
			$('#FloatingWindow').fadeOut(opt.spd, function(){
				scroll_on();
				$(this).remove();
			});
		};

		// bodyのスクロールキャンセル
		var scroll_off = function() {
			top_when_win_open = glbl.body.top;
			glbl.body.elm.css({
				top : glbl.body.top * -1
			});
			glbl.body.elm.addClass(noscroll_cls);
		};

		var scroll_on = function() {
			glbl.body.elm.removeClass(noscroll_cls).removeAttr('style');
			glbl.win.elm.scrollTop(top_when_win_open);
		};

		// 実行
		btn.on({
			'click.floating_window' : function(){
				contents_build();
				return false;
			}
		});
	});
};

// ===============================================
//
//	イベント設定・実行
// -----------------------------------------------
$(function(){
	glbl.body.elm = $('body');
	glbl.body.top = 0;
	glbl.body.scroll_top_get = function(){
		glbl.body.top = glbl.win.elm.scrollTop();
	};
	glbl.body.scroll_now = false;

	glbl.win.elm.on({
		// ウインドウリサイズ時にサイズ取得
		'resize' : function(event) {
			glbl.win.size_get();
		},
		// スクロール値取得
		'scroll' : function(event) {
			glbl.body.scroll_top_get();
		}
	});
});