/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

(function( $ ) {
	
    var save_icon = new Image();
    save_icon.src = SITE_URL + '/app/icons/16x16/save.png';

    var cancel_icon = new Image();
    cancel_icon.src = SITE_URL + '/app/icons/16x16/delete.png';

	var setup_mouseevents = function($this, localdata) {
		$this.on('mouseout.valcomment', function(event){
			event.preventDefault();
			localdata.ele.css({'display': 'none'});
			$this.off('mousemove.valcomment');
			return false;
		});
		$this.on('mouseover.valcomment', function(event){
			event.preventDefault();
			localdata.ele.css({'display': 'block', opacity: '1', 'left': (event.pageX + 10) + 'px', 'top': (event.pageY + 10) + 'px'});
			$this.on('mousemove.valcomment', function(event){
				event.preventDefault();
				localdata.ele.css({'left': (event.pageX + 10) + 'px', 'top': (event.pageY + 10) + 'px'});
				return false;
			});					
			return false;
		});
	}

    var methods = {
		init: function(options) {
            return this.each(function() {
                var $this = $(this);
                var localdata = {};
                localdata.settings = {
                    value_id: -1, // negative means no restype_id known
					comment: null
                };
                localdata.ele = {};
				/*
                var pos = $this.position();
                if (!$this.hasClass('propedit_frame')) {
                    pos.top += $this.closest('.propedit_frame').scrollTop() + $this.outerHeight(); // was closest('tabContent')
                }
				*/
                $.extend(localdata.settings, options);
				$this.css({'cursor': 'pointer'});
				localdata.ele = $('<div>').addClass('value_comment tooltip').css({'display': 'none', opacity: '1', 'position': 'fixed', 'z-index': 1000}).text(localdata.settings.comment).appendTo('body');
				if (localdata.settings.comment != null) {
					setup_mouseevents($this, localdata);
				}
				$this.on('click', function(event){
					$this.valcomment('edit');
				});
                $this.data('localdata', localdata); // initialize a local data object which is attached to the DOM object
			});
		},
		
		edit: function() {
            return this.each(function(){
                var $this = $(this);
                var localdata = $this.data('localdata');
				$this.off('.valcomment');
				localdata.ele.empty();
				var btn_toolbar = $('<div>').addClass('btn-toolbar');
				var btn_group = $('<div>').addClass('btn-group btn-group-xs');



				localdata.ele.append($('<textarea>').append(localdata.settings.comment))
					.append(btn_toolbar.append(btn_group));

				btn_group.append($('<button>').addClass('btn btn-default btn-xs').append(
					$('<span>').addClass('glyphicon glyphicon-save'))
					.attr({title: strings._save})
					.on('click', function(event) {
						localdata.settings.comment = localdata.ele.find('textarea').val();
						SALSAH.ApiPut('values/' + encodeURIComponent(localdata.settings.value_id),
							{
								comment: localdata.settings.comment
							},
							function(data) {
								if (data.status == ApiErrors.OK) {

                                    /*if (localdata.settings.onChange !== undefined && typeof(localdata.settings.onChange) == "function") {
                                        // comment has been updated, execute onChange callback
                                        console.log("calling onChange"); 
                                        localdata.settings.onChange();
                                    }*/

                                    localdata.settings.value_id = data.id;

									localdata.ele.empty().css({'display': 'none'});
									localdata.ele.text(localdata.settings.comment);
									setup_mouseevents($this, localdata);
								}
								else {
									alert(data.errormsg);
								}
							}
						);
						/*
						 $.__post(SITE_URL + '/ajax/update_value_comment.php', {
						 val_id: localdata.settings.value_id,
						 comment: localdata.settings.comment
						 }, function(data){
						 localdata.ele.empty().css({'display': 'none'});
						 localdata.ele.text(localdata.settings.comment);
						 setup_mouseevents($this, localdata);
						 }, 'json');
						 */
					}));
                btn_group.append(
                    $('<button>').addClass('btn btn-default btn-xs')
                        .attr({title: strings._delete})
                        .append($('<span>').addClass('glyphicon glyphicon-trash'))
                        .on('click', function (event) {
                        SALSAH.ApiDelete('valuecomments/' + encodeURIComponent(localdata.settings.value_id),
                            function(data) {
                                if (data.status == ApiErrors.OK) {
                                    localdata.ele.empty().css({'display': 'none'});
                                    localdata.settings.comment = null;
                                    localdata.settings.value_id = data.id;
                                }
                                else {
                                    alert(data.errormsg);
                                }
                            }
                        );
                    }));
                btn_group.append(
                    $('<button>').addClass('btn btn-default btn-xs')
                        .attr({title: strings._cancel})
                        .append($('<span>').addClass('glyphicon glyphicon-remove'))
                        .on('click', function (event) {
                            localdata.ele.empty().css({'display': 'none'});
                            localdata.ele.text(localdata.settings.comment);
                            setup_mouseevents($this, localdata);
                        })
                );

//				$('<textarea>').append(localdata.settings.comment).appendTo(localdata.ele);
//				$('<br>').appendTo(localdata.ele);
				/*
				$('<img>', {src: save_icon.src, title: strings._save}).on('click', function(event) {
					localdata.settings.comment = localdata.ele.find('textarea').val();
					SALSAH.ApiPut('values/' + localdata.settings.value_id,
						{comment: localdata.settings.comment},
						function(data) {
							if (data.status == ApiErrors.OK) {
								localdata.ele.empty().css({'display': 'none'});
								localdata.ele.text(localdata.settings.comment);
								setup_mouseevents($this, localdata);
							}
							else {
								alert(data.errormsg);
							}
						}
					);
					/*
					$.__post(SITE_URL + '/ajax/update_value_comment.php', {
						val_id: localdata.settings.value_id,
						comment: localdata.settings.comment
					}, function(data){
						localdata.ele.empty().css({'display': 'none'});
						localdata.ele.text(localdata.settings.comment);
						setup_mouseevents($this, localdata);						
					}, 'json');
					*/
				//}).appendTo(localdata.ele);
/*
				$('<img>', {src: cancel_icon.src, title: strings._cancel}).on('click', function(event){
					localdata.ele.empty().css({'display': 'none'});
					localdata.ele.text(localdata.settings.comment);
					setup_mouseevents($this, localdata);						
				}).appendTo(localdata.ele);
				*/
				var offs = $this.offset();
				localdata.ele.css({'display': 'block'});
				localdata.ele.css({'left': (offs.left + 10) + 'px', 'top': (offs.top + 10) + 'px'});
            });			
		}
	};

    $.fn.valcomment = function(method) {
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