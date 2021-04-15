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

(function( $ ){
    'use strict';

    var methods = {
        init: function(options) {

            return this.each(function() {

                var $this = $(this);
                var localdata = {};
                localdata.settings = {
                    site_url: 'http://www.salsah.org',
                    label: 'type of link',
                    spec: {
                        label: undefined,
                        url: undefined,
                    },
                    url: 'https://www.dasch.swiss',
                    draggable: true
                };

                $.extend(localdata.settings, options);

                var label = $('<em>')
                    .addClass('propedit label')
                    .text(localdata.settings.label + ' ');

                if (localdata.settings.spec.url && localdata.settings.spec.label) {
                    label.append(
                        $('<a>')
                            .attr({href: localdata.settings.spec.url, target: '_blank'})
                            .addClass('spec')
                            .text(localdata.settings.spec.label));
                }

                label.append(': ');

                var drag = $('<img>')
                    .addClass('icon')
                    .attr({src: localdata.settings.site_url + '/app/icons/16x16/attachment.png', title: 'Copy to clipboard'})
                    .on('click', function() {
                        var input = $(this).next('.clipit')
                        $(input[0]).select();
                        var copied = document.execCommand('copy');

                        // console.log(copied);
                    }
                );

                if (localdata.settings.draggable) {
                    drag.dragndrop('makeDraggable', 'HANDLE_ID', {handle_id: localdata.settings.url});
                }

                var url = $('<input>')
                    .attr({type:'text', readOnly: true, size: '64'})
                    .addClass('clipit').val(localdata.settings.url);

                $(this).append(label).append(drag).append(url);

                $this.data('localdata', localdata); // initialize a local data object which is attached to the DOM object

            });
        }
    };

    $.fn.clipurl = function(method) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            throw 'Method ' +  method + ' does not exist on jQuery.clipurl';
        }
    };
    /*===========================================================================*/

})( jQuery );
