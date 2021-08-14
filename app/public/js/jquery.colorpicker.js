/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

(function( $ ){
	var palette = Array('#ff3333', '#33ff33', '#3333ff', '#ffff33', '#33ffff', '#ff9999', '#99ff99', '#9999ff', '#ffff99', '#99ffff');
	

	var methods = {
		init: function(options) {
			return this.each(function() {
				var $this = $(this);
				var localdata = {};
				localdata.settings = {
					ncolors: 8,
				};
				$.extend(localdata.settings, options);
				$(this).append($('<div>', {width: 15, height: 15}).css({
					'float': 'left',
					'margin': '2px',
					'background-color': localdata.settings.color,
				}));
				$this.data('localdata', localdata); // initialize a local data object which is attached to the DOM object
			});			
		},
		edit: function(options) { // $(element).regions('init', {settings: here,...});
			return this.each(function() {
				var $this = $(this);
				var i;
				var localdata = {};
				localdata.settings = {
					ncolors: 8,
				};
				$.extend(localdata.settings, options);
				localdata.selected_col = 0;
				if (typeof localdata.settings.color !== 'undefined') {
					for (i in palette) {
						if (palette[i] == localdata.settings.color) {
							localdata.selected_col = i;
							break;
						}
					}
				}
				for (var cc = 0; cc < localdata.settings.ncolors; cc++) {
					$this.append($('<div>', {width: 15, height: 15}).css({
						'float': 'left',
						'margin': '1px',
						'background-color': palette[cc],
						'data-colnum': cc,
						'border': (cc == localdata.selected_col) ? '2px solid black' : '2px solid white',
					}).click({colnum: cc, color: palette[cc]}, function(event) {
						$($this.find('div').get(localdata.selected_col)).css('border', '2px solid white');
						$(this).css('border', '2px solid black');
						localdata.selected_col = event.data.colnum;
						if (localdata.settings.color_changed_cb instanceof Function) {
							localdata.settings.color_changed_cb(palette[localdata.selected_col]);
						}
					}));
				}
				$this.data('localdata', localdata); // initialize a local data object which is attached to the DOM object
			});
		},
		/*===========================================================================*/
		
		value: function(options) {
			if (this.length > 1) {
				var cols = [];
				this.each(function() {
					var $this = $(this);
					var localdata = $this.data('localdata');
					cols.push(palette[localdata.selected_col]);
				});
				return cols;
			}
			else {
				var $this = $(this);
				var localdata = $this.data('localdata');
				return palette[localdata.selected_col];
			}
		},
		/*===========================================================================*/

		anotherMethod: function(options) {
			return this.each(function(){
				var $this = $(this);
				var localdata = $this.data('localdata');
			});
		},
		/*===========================================================================*/
	}
	
	$.fn.colorpicker = function(method) {
	    // Method calling logic
	    if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      throw 'Method ' +  method + ' does not exist on jQuery.tooltip';
	    }
	};
})( jQuery );