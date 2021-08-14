/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
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
                    draggable: false
                };

                $.extend(localdata.settings, options);

                var label = $('<em>')
                    .addClass('propedit label')
                    .text(localdata.settings.label + ' ');

                if (localdata.settings.spec.url && localdata.settings.spec.label) {
                    label.append(
                        $('<a>')
                            .attr({ href: localdata.settings.spec.url, target: '_blank' })
                            .addClass('spec')
                            .text(localdata.settings.spec.label));
                }

                label.append(': ');

                var drag = $('<img>')
                    .addClass('icon')
                    .attr({src: localdata.settings.site_url + '/app/icons/16x16/attachment.png', title: 'Copy to clipboard'})
                    .on('click', function() {
                        var input = $(this).next('.clipit')
                        input.first().select();
                        var copied = document.execCommand('copy');

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
