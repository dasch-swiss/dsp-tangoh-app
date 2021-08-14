/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

// this plugin handles taskbar symbols between different tabs
(function( $ ) {


	var methods = {
		init: function() {
			return this.each(function(){
								
				var $this = $(this);
				var localdata = {};

				$this.empty();
				$this.data('localdata', localdata); // initialize a local data object which is attached to the DOM object
				
				localdata.elements = {};
				localdata.active = null;
			});
		},
		
		add: function(name, ele) {
			return this.each(function(){
				var $this = $(this);
				var localdata = $this.data('localdata');
				if (localdata.active !== null) localdata.elements[localdata.active].css({display: 'none'});
				ele.css({
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					display: 'block'
				});
				if (localdata.elements[name] !== undefined) {
					localdata.elements[name].remove(); //remove from DOM
				}
				$this.append(ele);
				localdata.elements[name] = ele;
				localdata.active = name;
			});
		},
		
		remove: function(name, name2) {
			return this.each(function(){
				var $this = $(this);
				var localdata = $this.data('localdata');
				if (localdata.elements[name] !== undefined) {
					localdata.elements[name].remove();
					delete localdata.elements[name];
				}
				if (name2 === undefined) {
					localdata.active = null;
				}
				else {
					localdata.elements[name2].css({display: 'block'});
					localdata.active = name2;
				}
			});
		},
		
		show: function(name) {
			return this.each(function(){
				var $this = $(this);
				var localdata = $this.data('localdata');
				if (localdata.elements[name] !== undefined) {
					if (localdata.active !== null) localdata.elements[localdata.active].css({display: 'none'});
					localdata.elements[name].css({display: 'block'});
					localdata.active = name;
				}
			});
		},
		
		hide: function() {
			return this.each(function(){
				var $this = $(this);
				var localdata = $this.data('localdata');
				if (localdata.active !== null) localdata.elements[localdata.active].css({display: 'none'});
				localdata.active = null;
			});
		},
		
		get: function(name) {
			var $this = $(this);
			var localdata = $this.data('localdata');
			if (localdata.elements[name] !== undefined) {
				return localdata.elements[name];
			}
			else {
				return false;
			}
		}
/*		
		anotherMethod: function(options) {
			return this.each(function(){
				var $this = $(this);
				var localdata = $this.data('localdata');
			});
		}
*/
		/*===========================================================================*/
	};
	
	$.fn.elestack = function(method) {
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