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
                    label: 'type of link',
                    url: 'https://www.dasch.swiss'
                };

                $.extend(localdata.settings, options);

                $(this).append($('<input>')
                    .attr({type:'text', readOnly: true, size: '64'})
                    .addClass('clipit').val(localdata.settings.url));

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
