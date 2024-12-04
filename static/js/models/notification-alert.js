(function( $ ){
   
  var NotificationsAlert = function( el, options ) {
    this.options  = options;
    this.$element = $(el).on('clear', $.proxy(this.dismiss, this))
    this.$countValue = $(el).find('.notificationsCount')
    this.count = 0;
    this.messagePollTimer = 2 * 60 * 1000; // Start at 2 min.
    this.load();
    setTimeout(this.pollForMessages.bind(this), this.messagePollTimer);

  }
  NotificationsAlert.prototype = {
    
    constructor: NotificationsAlert 
    
    , load: function() {
      scratch.notifications.loadUnRead($.proxy(this.onLoad, this));
    }

    , pollForMessages: function() {
      this.load();
      // Stop after 32 minutes -- this matches www's backoff behavior.
      if (this.messagePollTimer < 32 * 60 * 1000) {
          // Exponentially decay the time between message polling. e.g. 2, 4, 8, 16
          this.messagePollTimer *= 2;
          setTimeout(this.pollForMessages.bind(this), this.messagePollTimer);
      }
    }

    , onLoad: function(notifications, status) {
      if (notifications.msg_count && notifications.msg_count != this.count) {
        this.$countValue.offset({ top: '-30'});
        this.$countValue.text(notifications.msg_count);
        this.$countValue.animate({ top: '4'}, 200);
        this.count = notifications.msg_count;
      } else if (!notifications.msg_count) {
        this.dismiss()
      }
    }
    , dismiss: function() {
      this.$countValue.stop();
      this.$countValue.offset({ top: '-30'});
    }
  }
  
  $.fn.notificationsAlert = function( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('notifications')
        , options = $.extend({}, $.fn.notificationsAlert.defaults, $this.data(), typeof option == 'object' && option)
      if(!data) $this.data('notifications', (data = new NotificationsAlert(this, options)));
    });
  }

  $.fn.notificationsAlert.defaults = {
      notificationsing: false
    , type: 'user'
  }
  
  $.fn.notificationsAlert.Constructor = NotificationsAlert 

})( window.jQuery );
