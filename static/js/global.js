(function( $ ) {
  $.fn.scratchIncrementCount = function(val) {
    var count = parseInt(this.html(), 10);
    count+=val;
    this.html(count);
  };

  $.withCSRF = function(f) {
    $.get('/csrf_token/', function(data, status, xhr) {
      csrf = ("; " + document.cookie).split('; scratchcsrftoken=')[1].split(';')[0];
      f(csrf);
    });
  };
})( jQuery );

$.ajaxSetup({
  jsonp: false
});

$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('scratchcsrftoken'));
    }
});

/* add a callback for ajax errors where no handler is defined */
$(document).ajaxError(function(event, xhr, ajaxSettings, thrownError) {
  if ( ajaxSettings.error===undefined ){ // if no error handler is defined
    
    if ( location.port==='' ){ // log non-dev-port errors to Google Analytics
      throw 'Uncaught ajax error. Attempted URL: '+ajaxSettings.url+'   Status: '+ xhr.status;
    } else if ( xhr.status===0 ){ // else we're on a dev port and with a response status 0
      // Workaround for successful requests incorrectly appearing to fail on dev ports. Not applicable on production.
      // see https://code.google.com/p/chromium/issues/detail?id=195550
      ajaxSettings.success(ajaxSettings.fakeResponseForDevPortAjaxFail,xhr.status,xhr);
      console.error('Status 0 ajax bug. Calling success(options.fakeResponseForDevPortAjaxFail, xhr.status, xhr)');
    }
  }
});

function setCue(cue, value, done) {
  $.withCSRF(function(csrftoken){
    $.ajax({
      url: '/site-api/users/set-template-cue/',
      type: 'POST',
      data: JSON.stringify({'cue': cue, 'value': value, 'csrftoken': csrftoken}),
    })
    .done(done)
    .error(function(data, textStatus, jqXHR){
      document.cookie = "cue_" + cue + "=" + value;
      done(data, textStatus, jqXHR);
    });
  });
}

function openDialogue(element, dialog_options) {
    $(element).dialog(dialog_options);
}

function openResendDialogue() {
    var dialog_options = {
        title: gettext("Want to share on Scratch?"),
        open: function( event, ui ) {
            var self = this;
            $('#close-resend-dialog').off();
            $('#close-resend-dialog').click(function() {
                $(self).dialog("close");
            });
            $('#email-resend-box form').submit(function(e) {
                e.preventDefault();
                $.ajax({
                    url: '/accounts/email_resend/',
                    type: "POST",
                    data: {email_address: $('#hidden-email-address').val()},
                    success: function(data) {
                        $('#submit-resend', self).attr('disabled', 'disabled');
                        $('#submit-resend', self).val('Resent');
                    }
                })
            });
            $('#email-resend-box :link').blur();
        },
        close: function( event, ui ) {
            $(this).dialog('destroy');
            $('.ui-widget-overlay.ui-front').remove();
        },
        show: {
            effect: 'clip',
            duration: 250,
        },
        hide: {
            effect: 'clip',
            duration: 250,
        } 
    };

    if ($('#email-resend-box').length > 0) {
        openDialogue('#email-resend-box', dialog_options);
    } else {
        $.ajax({
            url: '/accounts/email_resend/',
        }).done(function(data) {
            var template = $(_.template(data)());
            openDialogue(template, dialog_options);
        });
    }
}



/* extend twitter-bootstrap-dropdown.js to handle more select style dropdown for filters */
$(document).on('click', '.dropdown.select ul li', function() {
  var text = $(this).text();
  var $dropdown = $(this).closest('.dropdown');
  var $selected = $dropdown.find('.selected');
  $dropdown.find('li.hide').removeClass('hide');
  $(this).addClass('hide');
  $selected.text(text);
});

$(document).on('click', '.dropdown.radio-style ul li', function() {
  var $dropdown = $(this).closest('.dropdown');
  $dropdown.find('.selected').removeClass('selected');
  $(this).addClass('selected');
});

$.urlParam = function (name) {
  if (window.location.search.indexOf(name) == -1) {
    return null;
  } else {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
  }
};
