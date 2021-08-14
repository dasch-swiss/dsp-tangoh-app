/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

function metadata_event(table) {
	$(table).find('.labelrow').bind('click', function() {
		$(this).parent().find('.datarow').toggle();
		if ($(this).parent().find('.datarow').css('display') == 'block') {
			$(this).addClass('opened');
		} else {
			$(this).removeClass('opened');
		}
	});
}