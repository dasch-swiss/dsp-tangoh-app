/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

var the_infowin = undefined; // global variable!!
var the_infowin_pending = false;


var load_infowin = function(event, res_id, obj) {
	if (the_infowin_pending) return;

//	window.status = 'load_infowin (' + event.pageX + ', ' + event.pageY + ') ' + the_infowin_pending;

	var position_it = function(event) {
		var xpos = event.pageX;
		var ypos = event.pageY;
		var win_w = $('body').width();
		var win_h = $('body').height();
		var w, h;
		if (the_infowin === undefined) {
			w = 200;
			h = 50;
		}
		else {
			w = the_infowin.outerWidth(true);
			h = the_infowin.outerHeight(true);
		}
		if ((xpos + 20 + w) > win_w) {
			xpos = xpos - w - 20;
		}
		else {
			xpos += 20;
		}
		if ((ypos + 10 + h) > win_h) ypos = win_h - 10 - h;
		ypos += 10;
		return {x: xpos, y: ypos};
	}


	if (the_infowin === undefined) {
		the_infowin_pending = true;


		SALSAH.ApiGet('resources.html', res_id, {noresedit: true, reqtype: "properties"}, function(htmlString) {
			window.status = 'GET...';

			props = htmlString;
			var pos = position_it(event);
			the_infowin = $('<div>').addClass('searchinfowin').css({
				position: 'absolute',
				minHeight: '50px',
				maxHeight: '600px',
				minWidth: '200px',
				maxWidth: '400px',
				overflow: 'hidden',
				left: pos.x,
				top: pos.y,
				zIndex: 200
			}).html(props).on('mousemove', function(event) {
				var pos = position_it(event);
				the_infowin.css({
					left: pos.x,
					top: pos.y
				});
			}).appendTo($('body'));

			pos = position_it(event);
			the_infowin.css({
				left: pos.x,
				top: pos.y
			});

			$(obj).on('mousemove', function(event) {
				event.stopImmediatePropagation();
				event.preventDefault();
				var pos = position_it(event);
				the_infowin.css({
					left: pos.x,
					top: pos.y
				});
			});

			$(document).on('mousemove', function(event){
				if (the_infowin !== undefined) {
					the_infowin.remove();
					the_infowin = undefined;
					$(document).off('mousemove');
					$(obj).off('mousemove');
					the_infowin_pending = false;
				}
			});

			the_infowin_pending = false;

		});
	};

}


var load_value_infowin = function(event, val_id, obj) {
	if (the_infowin_pending) return;

//	window.status = 'load_infowin (' + event.pageX + ', ' + event.pageY + ') ' + the_infowin_pending;

	var position_it = function(event) {
		var xpos = event.pageX;
		var ypos = event.pageY;
		var win_w = $('body').width();
		var win_h = $('body').height();
		var w, h;
		if (the_infowin === undefined) {
			w = 200;
			h = 50;
		}
		else {
			w = the_infowin.outerWidth(true);
			h = the_infowin.outerHeight(true);
		}
		if ((xpos + 20 + w) > win_w) {
			xpos = xpos - w - 20;
		}
		else {
			xpos += 20;
		}
		if ((ypos + 10 + h) > win_h) ypos = win_h - 10 - h;
		ypos += 10;
		return {x: xpos, y: ypos};
	}


	if (the_infowin === undefined) {
		the_infowin_pending = true;


		SALSAH.ApiGet('values/' + encodeURIComponent(val_id), function(data) {
			if (data.status == ApiErrors.OK) {
			window.status = 'GET...';

			var pos = position_it(event);
			the_infowin = $('<div>').addClass('searchinfowin').css({
				position: 'absolute',
				minHeight: '50px',
				maxHeight: '600px',
				minWidth: '200px',
				maxWidth: '400px',
				overflow: 'hidden',
				left: pos.x,
				top: pos.y,
				zIndex: 200
			}).html('<p>' + strings._owner + ': ' + data.valuecreatorname + '<br/>' + strings._creation_date + ': ' + data.valuecreationdate + '</p>').on('mousemove', function(event) {
				var pos = position_it(event);
				the_infowin.css({
					left: pos.x,
					top: pos.y
				});
			}).appendTo($('body'));

			pos = position_it(event);
			the_infowin.css({
				left: pos.x,
				top: pos.y
			});

			$(obj).on('mousemove', function(event) {
				event.stopImmediatePropagation();
				event.preventDefault();
				var pos = position_it(event);
				the_infowin.css({
					left: pos.x,
					top: pos.y
				});
			});

			$(document).on('mousemove', function(event){
				if (the_infowin !== undefined) {
					the_infowin.remove();
					the_infowin = undefined;
					$(document).off('mousemove');
					$(obj).off('mousemove');
					the_infowin_pending = false;
				}
			});

			the_infowin_pending = false;

			}
			else {
				alert(data.errormsg);
			}
		});
	}
}
