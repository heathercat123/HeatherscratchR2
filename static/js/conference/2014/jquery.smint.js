/*

SMINT V1.0 by Robert McCracken
SMINT V2.0 by robert McCracken with some awesome help from Ryan Clarke (@clarkieryan) and mcpacosy ‏(@mcpacosy)

SMINT is my first dabble into jQuery plugins!

http://www.outyear.co.uk/smint/

If you like Smint, or have suggestions on how it could be improved, send me a tweet @rabmyself
Messed around with by Chris Graves

*/


(function(){


	$.fn.smint = function( options ) {

		// adding a class to users div
		$(this).addClass('smint')

		var settings = $.extend({
			'scrollSpeed '  : 500
		}, options);

		//Set the variables needed
		var optionLocs = new Array();
		var lastScrollTop = 0;
		var menuHeight = $(".smint").height();
		var stickyTop = $('#gallery').position().top+$('#gallery').outerHeight(true);	
		var scrolling = false;

		return $('.smint a').each( function(index) {

			if ( settings.scrollSpeed ) {
				var scrollSpeed = settings.scrollSpeed
			}

			//Fill the menu
			var id = $(this).attr("id");
			optionLocs.push(Array($("div."+id).position().top-menuHeight, $("div."+id).height()+$("div."+id).position().top, id));

			///////////////////////////////////

			// get initial top offset for the menu 
			

			// check position and make sticky if needed
			var stickyMenu = function(direction){
				// current distance top
				var scrollTop = $(window).scrollTop();
				stickyTop = $('#gallery').position().top+$('#gallery').outerHeight(true);	

				// if we scroll more than the navigation, change its position to fixed and add class 'fxd', otherwise change it back to absolute and remove the class
				if (scrollTop > stickyTop) { 
					if(!$('.smint').hasClass('fxd')) {
						$('.smint').css({ 'position': 'fixed', 'top':0 }).addClass('fxd');
						$('.smint a').each(function() {
							$(this).parent().removeClass('hover');
						});
						if(!scrolling)	$('.smint a').first().parent().addClass('hover');
					}
				} else {
					$('.smint').css({ 'position': 'absolute', 'top':stickyTop }).removeClass('fxd');
					$('.smint a').each(function() {
						$(this).parent().removeClass('hover');
					});
				}   

				//Check if the position is inside then change the menu
				// Courtesy of Ryan Clarke (@clarkieryan)


				if(!scrolling && optionLocs[index][0] <= scrollTop && scrollTop <= optionLocs[index][1]){	
					if(direction == "up" ){
						$("#"+id).parent().addClass("hover");
						if (index+1 < optionLocs.length) $("#"+optionLocs[index+1][2]).parent().removeClass("hover");
					} else if(index > 0) {
						$("#"+id).parent().addClass("hover");
						$("#"+optionLocs[index-1][2]).parent().removeClass("hover");
					} else if(direction == undefined){
						$("#"+id).parent().addClass("hover");
					}
					$.each(optionLocs, function(i){
						if(id != optionLocs[i][2]){
							$("#"+optionLocs[i][2]).parent().removeClass("hover");
						}
					});
				}
			};

			// run functions
			stickyMenu();

			// run function every time you scroll
			$(window).scroll(function() {
				//Get the direction of scroll
				var st = $(this).scrollTop();
				if (st > lastScrollTop) {
					direction = "down";
				} else if (st < lastScrollTop ){
					direction = "up";
				}
				lastScrollTop = st;
				stickyMenu(direction);

				// Check if at bottom of page, if so, add class to last <a> as sometimes the last div
				// isnt long enough to scroll to the top of the page and trigger the active state.

				
				if($(window).scrollTop() + $(window).height() == $(document).height()) {
					$('.smint a').each(function() {
						$(this).parent().removeClass('hover');
					});
					$('.smint a').last().parent().addClass('hover');
				}
			});

			$(window).resize(function () {

				$('.inner').css({height: 0.333*$('#gallery').width()});
				$('.inner').css({'padding-top': $('#gallery').height()-110});
			    optionLocs[index] = Array($("div."+id).position().top-menuHeight, $("div."+id).height()+$("div."+id).position().top, id);
				stickyMenu();
			});

			///////////////////////////////////////


			$(this).on('click', function(e){
				$('.smint a').each(function() {
					$(this).parent().removeClass('hover');
				});
				// gets the height of the users div. This is used for off-setting the scroll so the menu doesnt overlap any content in the div they jst scrolled to
				var selectorHeight = $('.smint').height();   

        		// stops empty hrefs making the page jump when clicked
        		e.preventDefault();

				// get id pf the button you just clicked
				var id = $(this).attr('id');

		 		// if the link has the smint-disable class it will be ignored 
		 		// Courtesy of mcpacosy ‏(@mcpacosy)

		 		if ($(this).hasClass("smint-disable"))
		 		{
		 			return false;
		 		}

				// gets the distance from top of the div class that matches your button id minus the height of the nav menu. This means the nav wont initially overlap the content.
				var goTo =  $('div.'+ id).offset().top -selectorHeight + 5;

				scrolling = true;
				// Scroll the page to the desired position!
				$("html, body").animate({ scrollTop: goTo }, scrollSpeed);

				setTimeout(function(e) { 
					scrolling = false;
					stickyMenu();
				}, scrollSpeed);
			});	
});
}


})();