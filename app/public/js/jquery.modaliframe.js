/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

(function($) {
	$.extend({
		modaliframe: function(id, width, height, src) {			
			var idim = innerdim();
			if (width < 0) width = idim.width + width;
			if (height < 0) height = idim.height + height;
		
			var idid = id;
			var shade = $('<div>', {
				'id' : 'shade'
			}).css({
				zIndex: 88,
				position: 'fixed',
				left: '0px',
				top: '0px',
				width: String(idim.width) + 'px',
				height: String(idim.height) + 'px',
				opacity: '0.7',
				filter: 'alpha(opacity=70)',
				visibility: 'visible',
				backgroundColor: 'rgb(0, 0, 0)'
			}).appendTo("body");
			var xpos = (idim.width - width) / 2;
			var ypos = (idim.height - height) / 2;
			var box = $('<div>', {
				width: String(width) + 'px',
				height: String(height) + 'px',				
			}).css({
				opacity: '1.0',
				filter: 'alpha(opacity=100)',
				visibility: 'visible',
				zIndex: 99,
				width: String(width) + 'px',
				height: String(height) + 'px',				
				position: 'fixed',
				left: String(xpos) + 'px',
				top: String(ypos) + 'px',
				border: 'outset',
				borderWidth: '5px',
			}).appendTo("body");
			var iframe = $('<iframe>', {
				id: 'modaliframe',
				width: String(width - 5) + 'px',
				height: String(height - 25) + 'px',
				src: src,
			}).css({
				position: 'absolute',
				left: '0px',
				top: '0px',
				right: '0px',
				bottom: '10px',				
			});
			box.append(iframe);
			var cancelbox = $('<div>').css({
				opacity: '1.0',
				filter: 'alpha(opacity=100)',
				visibility: 'visible',
				zIndex: 99,
				width: String(width - 4) + 'px',
				marginLeft: 'auto',
				marginRight: 'auto',
				height: '20px',				
				position: 'absolute',
				left: '0px',
				bottom: '0px',
				border: 'outset',
				borderWidth: '2px',
				backgroundColor: 'rgb(100, 255, 100)',
				textAlign: 'center',
			}).text('CLOSE').bind('click', function(ev){
				shade.remove();
				box.remove();
				formobj.cancel_field(idid);
				$('#' + id).attr('src', $('#' + id).attr('src'));
			});
			box.append(cancelbox);
			return;
		}
	});
	
})(jQuery);

