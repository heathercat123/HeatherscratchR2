$(document).ready(function(){
 // $('.slider-carousel').sliderCarousel();
  scratch.notifications.loadActivity($('#test'), {'friends': true, 'max': 5}, function() {
    if ($('#activity-feed').children().length == 0) {
      $('#whats-happenin .empty-field').show();
      $('#activity-feed').hide();
    }
  }
  )
  $('.play-button')
  .one('click',function () {
    //$('#modal-video').html($('#intro-video-swf').html());
  })
  .on('click',function () {
    $('#modal-video').modal('show');
    if (!$('#modal-video iframe').attr('src')) {
      $('#modal-video iframe').attr('src', 'http://player.vimeo.com/video/65583694?title=0&amp;byline=0&amp;portrait=0');
    } 
  });

  $('#modal-video .close').on('click', function() {
    $('#modal-video iframe').attr('src', '');
    $('#modal-video').modal('hide'); 
  }); 
  // Set cookie to dismiss welcome box for newcomers
  $('#welcome-to-scratch [data-control="set"]').on('click', setCue);

  //$('#welcome-to-scratch [data-control="dismiss"]').on('click', dismissCue);

  $.getScript('/external/blog/api/read/json/?callback="displayPosts"&num=3');

    if (Scratch.INIT_DATA.ADMIN) {
      this.adminView = new Scratch.AdminPanel({model: {}, el: $('#admin-panel')}); 
    }
})
function setCue() {
  console.log('setting');
  $.ajax({
    url: '/site-api/users/set-template-cue/',
    type: 'POST',
    data: JSON.stringify({'cue': 'welcome'}),
  })
  .done(function(data) {
    $('#welcome-to-scratch').hide("slide", { direction: "up", complete: function() {$('#whats-happenin').show() }}, 1000); 
  });
}

function dismissCue() {
  console.log('dismissing');
  $.ajax({
    url: '/site-api/users/dismiss-template-cue/',
    type: 'POST',
    data: JSON.stringify({'cue': 'welcome'}),
  });
}

function displayPosts(data) {
  var items = [];
  var last = data['posts'].length -1;
  for (i=0; i < data['posts'].length; i++) {
    if (i == last) {
      items.push('<li class="last">');
    } else {
      items.push('<li>');
    }
    items.push('<a href="/news#' + data['posts'][i]['id'] + '"><img src="' + $(data['posts'][i]['regular-body']).find('img').attr('src') + '" /></a>');
    items.push('<div class="event-content"><span class="title"><a href="/news#' + data['posts'][i]['id'] + '">' + data['posts'][i]['regular-title'] + '</a></span>');
    items.push( $(data['posts'][i]['regular-body']).find('span.snippet').html() + '</div></li>');
  }
  $('<ul>', {
    html: items.join(''),
  }).addClass('event-list').appendTo('#news-feed'); 
}


}