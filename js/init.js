/*
 * Copyright (c) 2022 Marketify
 * Author: Marketify
 * This file is made for CURRENT TEMPLATE
*/

jQuery(document).ready(function(){

	"use strict";
	
	// here all ready functions
	edrea_tm_headline();
	
	jQuery(window).load('body', function(){
		edrea_tm_my_load();
	});
	
});


// -----------------------------------------------------
// ---------------   PRELOADER   -----------------------
// -----------------------------------------------------

function edrea_tm_preloader(){
	
	"use strict";
	
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
	var preloader = $('#preloader');
	
	if (!isMobile) {
		setTimeout(function() {
			preloader.addClass('preloaded');
		}, 800);
		setTimeout(function() {
			preloader.remove();
		}, 2000);

	} else {
		preloader.remove();
	}
}

// -----------------------------------------------------
// -----------------   MY LOAD    ----------------------
// -----------------------------------------------------

function edrea_tm_my_load(){
	
	"use strict";
	
	var speed	= 500;
	setTimeout(function(){edrea_tm_preloader();},speed);
}


