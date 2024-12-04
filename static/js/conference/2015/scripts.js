$(document).ready(function(){
	
    $( ".faq-click" ).click(function() {
		$(this).next(".collapse").slideToggle();
		
		if ( $(this).children(".faq-icon").hasClass("rotate") ) {
        	$(this).children(".faq-icon").removeClass("rotate");
		}
		
		else {
			$(this).children(".faq-icon").addClass("rotate");
		}
	});
	
	$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
});
    
});