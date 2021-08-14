/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

//
// expects the positions without the 'px' !!!!
//
function infoWin(startX, startY, width, height, content, ele) {
	//var browserDims = innerdim();
	var instance = this;
	var workwinDimY = $(RESVIEW.winclass).height();
	var workwinDimX = $(RESVIEW.winclass).width();

	var correct_position = function(xpos, ypos) {
		var height = infoWin.prototype.winobj.outerHeight(true)
		if((xpos + width) >= workwinDimX) {
			xpos += workwinDimX - (xpos + width);
		}
		if((ypos + height) >= workwinDimY) {
			ypos += workwinDimY - (ypos + height);
		}
		return {xpos: xpos, ypos: ypos};
	}

	this.moveTo = function(xpos, ypos) {
		if (typeof infoWin.prototype.winobj === 'undefined') return;
		
		var cpos = correct_position(xpos, ypos);
		
		infoWin.prototype.winobj.css({left : cpos.xpos + 'px', top : cpos.ypos + 'px'});
	}
	
	this.killInfoWin = function() {
		if (typeof infoWin.prototype.winobj == 'undefined') return;
		infoWin.prototype.winobj.remove();
		delete infoWin.prototype.winobj;
	};

	//browserDimY = browserDims.height;
	//browserDimX = browserDims.width;
	

	if (typeof infoWin.prototype.winobj !== 'undefined') {
		infoWin.prototype.winobj.remove();
		delete infoWin.prototype.winobj;
	}

	infoWin.prototype.winobj = $('<div>', {
		'class': 'searchinfowin',
		mousemove: function(event) {
			instance.moveTo(event.pageX + 5, event.pageY + 5); // will only occur if moving window is slow
		}
	}).width(width).css({maxHeight: '600px'}).html(content).appendTo(ele);
	if (height > 0) {
		infoWin.prototype.winobj.height(height)
	}
	else {
		height = infoWin.prototype.winobj.outerHeight(true);
	}
	var cpos = correct_position(startX, startY);
	infoWin.prototype.winobj.css({position : 'absolute', left : cpos.xpos + 'px', top: cpos.ypos + 'px'})

	return this;
} 
