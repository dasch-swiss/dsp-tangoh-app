/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

function innerdim() {
	var w;
	if (window.innerWidth) {
		w = window.innerWidth;
	}
	else if (document.documentElement && document.documentElement.clientWidth) {
		w = document.documentElement.clientWidth;
	}	
	else if (document.body) {
		w = document.body.clientWidth;
	}
	var h;
	if (window.innerHeight) {
		h = window.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight) {
		h = document.documentElement.clientHeight;
	}	
	else if (document.body) {
		h = document.body.clientHeight;
	}
	return {width: w, height: h};
}