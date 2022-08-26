/*
 * Copyright © 2015-2021 the contributors (see Contributors.md).
 *
 * This file is part of Knora.
 *
 * Knora is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knora is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Knora.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author Lukas Rosenthaler <lukas.rosenthaler@unibas.ch>
 * @author Tobias Schwizer <t.schweizer@unibas.ch>
 * @package jqplugins
 *
 */
(function( $ ){

	var my = {};

	my.defaultCountryCode = 'CH';
	my.defaultLanguage = 'en';
	my.geoNamesApiServer = 'ws.geonames.net';
	my.geoNamesProtocol = 'https';

	my.featureClass = {
		AdministrativeBoundaryFeatures: 'A',
		HydrographicFeatures: 'H',
		AreaFeatures: 'L',
		PopulatedPlaceFeatures: 'P',
		RoadRailroadFeatures: 'R',
		SpotFeatures: 'S',
		HypsographicFeatures: 'T',
		UnderseaFeatures: 'U',
		VegetationFeatures: 'V'
	};

	my.defaultData = {
		userName: 'knora',
//		lang: SALSAH.userdata.lang
		lang: 'de'
	};

	var getGeoNames = function(method, data, callback, my) {
		var deferred = $.Deferred();
		// TODO: validate method(exists), and params
		$.ajax({
			url: my.geoNamesProtocol + '://' + my.geoNamesApiServer + '/' + method + 'JSON',
			dataType: 'jsonp',
			data: $.extend({}, my.defaultData, data),
			success: function(data) {
				deferred.resolve(data);
				if (!!callback) callback(data);
			},
			error: function (xhr, textStatus) {
				deferred.reject(xhr, textStatus);
				alert('Ooops, geonames server returned: ' + textStatus);
			}
		});
		return deferred.promise();
	};

	var node_path = function(hlist, hlist_node_id) {
		var node_list = [];

		var find_node = function(hlist, hlist_node_id, level) {
			var i;
			for (i in hlist) {
				if (hlist[i].id == hlist_node_id) {
					node_list[level] = hlist[i].id;
					return true;
				}
				if (hlist[i].children) {
					if (find_node(hlist[i].children, hlist_node_id, level + 1)) {
						node_list[level] = hlist[i].id;
						return true;
					}
				}
			}
			return false;
		};

		find_node(hlist, hlist_node_id, 0);

		return node_list;
	};

	var selection_changed = function(seldiv, hlist, ele, vsize) {
		var i;
		var level = parseInt(ele.data('level'));
		var node_id = ele.val();
		var node_list;

		var find_node = function(hlist, hlist_node_id, level) {
			var i;
			var nnode;
			for (i in hlist) {
				if (hlist[i].id == hlist_node_id) {
					return hlist[i];
				}
				if (hlist[i].children) {
					if ((node = find_node(hlist[i].children, hlist_node_id, level + 1)) !== undefined) {
						return node;
					}
				}
			}
			return undefined;
		};

		for (i = level + 1; i < seldiv.length; i++) {
			seldiv[i].remove();
		}
		seldiv.splice(level + 1);

		var selected = find_node(hlist, node_id, 0);


		var selele;
		if ((selected !== undefined) && selected.children) {
			level = level + 1;
			if ((vsize !== undefined) && (vsize > 1)) {
				seldiv[level] = $('<span>');
				seldiv[0].parent().append(seldiv[level]);
				selele = $('<select>').attr('size', vsize).addClass('propedit').data('level', level);
			}
			else {
				seldiv[level] = $('<div>');
				seldiv[0].parent().append(seldiv[level]);
				selele = $('<select>').addClass('propedit').data('level', level);
			}
			$('<option>', {value: 0, selected: 'selected'}).text(' ').appendTo(selele);
			for (i in selected.children) {
				$('<option>', {value: selected.children[i].id}).text(selected.children[i].label).appendTo(selele);
			}
			selele.on('change', function(event) {
				selection_changed(seldiv, hlist, $(this), vsize);
			});
			seldiv[level].append(selele);
		}

	};

	var methods = {
		init: function(options) {
			return this.each(function() {
				var $this = $(this);
				var localdata = {};
				localdata.settings = {
					value: undefined // inital value, if not overridden by options!
				};
				localdata.ele = {};
				$.extend(localdata.settings, options);

				$this.data('localdata', localdata); // initialize a local data object which is attached to the DOM object

				$.getJSON('https://ws.geonames.net/getJSON?geonameId=' + localdata.settings.value + '&username=knora&style=long', function(data) {

						$this.append(
							$('<span>')
							.text(String(data.name))
							.attr({title: data.name})
							.on('click', function(ev) {
								var ele = $('<div>').addClass('value_comment tooltip').css({'display': 'block', opacity: '1', 'position': 'fixed', 'z-index': 1000}).appendTo('body');
								ele.append($('<div>').text('X').on('click', function(){
									ele.remove();
								}));
								if (data.wikipediaURL) {
									ele.append(
										$('<a>').attr({
											href: 'http://' + data.wikipediaURL,
											target: '_blank'
										}).append($('<img>').attr({src: SITE_URL + '/app/icons/wikipedia.png'})).on('click', function() {
											ele.remove();
										})
									);
								}
								if ((data.lng) && (data.lat)) {
									ele.append(
										$('<a>').attr({
											href: 'http://maps.google.com/?q=' + data.lat + ',' + data.lng,
											target: '_blank'
										}).append($('<img>').attr({src: SITE_URL + '/app/icons/google_maps.png'})).on('click', function() {
											ele.remove();
										})
									);
								}
								var offs = $this.offset();
								ele.css({'display': 'block'});
								ele.css({'left': (offs.left + 10) + 'px', 'top': (offs.top + 10) + 'px'});
							})
							);

				}).fail(function( jqxhr, textStatus, error) {
					var err = textStatus + ", " + error;
					alert('Geonames getJSON error for ' + localdata.settings.value + ': ' + err);
				});
			});
		},

		edit: function(options) {
			return this.each(function() {
				var $this = $(this);
				var localdata = {};
				localdata.settings = {
					value: undefined, // inital value, if not overridden by options!
					vsize: 1,
					new_entry_allowed: false
				};
				localdata.ele = {};
				if ((options !== undefined) && (options instanceof Object)) {
					$.extend(localdata.settings, options); // initialize a local data object which is attached to the DOM object
				}
				else {
					localdata = $this.data('localdata');
					if (localdata === undefined) {
						localdata = {};
						localdata.settings = {
							value: undefined, // inital value, if not overridden by options!
							vsize: 1,
							new_entry_allowed: false
						};
						localdata.ele = {};
					}
					if (options !== undefined) {
						localdata.settings.value = options; // options is the actual value!
					}
				}
				$this.data('localdata', localdata);

				$this.html(
					my.input = $('<input>')
						.attr({
							type: 'text',
							id: 'city'})
						.addClass('input-large geonames_field')
				);

				my.input.focus().autocomplete({
					source: function (request, response) {
						getGeoNames('search', {
							featureClass: my.featureClass.PopulatedPlaceFeatures,
							featureClass: my.AdministrativeBoundaryFeatures,
							style: "full",
							maxRows: 12,
							name_startsWith: request.term
						}, function (data) {
							response($.map(data.geonames, function (item) {
								var displayName = undefined;
								for (var i in item.alternateNames) { // here we search through the alternate names to get the proper language
									if (item.alternateNames[i].lang == SALSAH.userprofile.userData.lang) {
										if (displayName === undefined) {
											displayName = item.alternateNames[i].name;
										}
										else {
											if (item.alternateNames[i].isPreferredName) displayName = item.alternateNames[i].name;
										}
									}
								}
								if (displayName === undefined) displayName = item.name;
								displayName = displayName + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName + ' [' + item.fclName +']';
								return {
									label: displayName,
									value: displayName,
									details: item
								};
							}));
						}, my);
					},
					minLength: 2,
					select: function( event, ui ) {
						$this.find('.geonames_field').data({geonameId: ui.item.details.geonameId});
						//alert('geonameId: ' + ui.item.details.geonameId + ', value: ' + ui.item.value + ', label: ' + ui.item.label + ' ' + ui.item.details.lat + ', ' + ui.item.details.lng);

						if (ui && ui.item && options && options.callback) {
							options.callback(ui.item.details);
						}
					},
					open: function () {
						$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
					},
					close: function () {
						$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
					}
				});
			});
		},

		value: function(options) {
			var $this = $(this);
			var localdata = $this.data('localdata');

			var geo_data = $this.find('.geonames_field').data();
			if (geo_data['geonameId'] !== undefined) {
				return geo_data['geonameId'].toString();
			} else {
				return undefined;
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
    };


    $.fn.geonames = function(method) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            throw 'Method ' +  method + ' does not exist on jQuery.geonames';
        }
    };
})( jQuery );
