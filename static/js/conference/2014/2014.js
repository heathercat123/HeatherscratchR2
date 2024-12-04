$(window).load(function(){

	var slider= $('#gallery').unslider({
		arrows: false,
		fluid: true,
		delay: 7500, 
		speed: 1200
	});

	var data = slider.data('unslider');


	$('#left-arrow').on('click', function(e){
		data.prev();
	});

	$('#right-arrow').on('click', function(e){
		data.next();
	});

	$('.inner').css({height: 0.333*$('.inner').width()});
	$('.inner').css({'padding-top': $('#gallery').height()-110});



	$('#menu').css({top: $('#gallery').position().top+$('#gallery').outerHeight(true)});
	$('#menu').smint({
		'scrollSpeed' : 500
	});
});


