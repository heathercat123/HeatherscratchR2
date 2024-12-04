/* Basic model view with broadcast events for success/error on changes */
Scratch.ModelView = Backbone.View.extend({
  initialize: function(attributes, options) {
    this.model.bind('error', this.onError, this);
    this.model.bind('changeSuccess', this.onChangeSuccess, this);
  },

  onError: function(data) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error']});
  },

  onChangeSuccess: function(data) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['changes-saved']});
  },
});


/* Takes a collection and displays it.
 * Includes controls to filter and sort the collection
 */
Scratch.CollectionView = Backbone.View.extend({
  events: {
    'click [data-control="load-more"]': 'loadMore',
    'click [data-control="sort"]':   'sort',
    'click [data-control="filter"]':  'filter',
    'click [data-control="remove-item"]' : 'removeItem',
    //'click [data-control="add-item"]' : 'addItem',
  },

  initialize: function(options) {
    this.options = options || {};
    if (this.options.template || this.options.collectionTemplate) {
      this.wrapperTemplate = this.options.template; // contains controls for sorting/ filtering the colleciton
      this.listTemplate = this.options.collectionTemplate; // html for diplaying the list items
    }
    this.model.bind('add', this.render, this);
    this.model.bind('remove', this.render, this);
    this.model.bind('remove', this.onRemove, this);
    this.model.bind('reset', this.render, this);
    this.model.bind('addItemsSuccess', this.onAddSuccess, this);
    this.model.bind('removeItemsSuccess', this.onRemoveSuccess, this);
    this.model.bind('error', this.onError, this);
    //this.model.bind('change', this.render, this);

    // initialize the element with the template so template elements
    // can be referenced
    if(this.wrapperTemplate)
        $(this.el).html(this.wrapperTemplate({collection:[]}));
  },

  onClose: function() {
    this.model.unbind('add', this.render);
    this.model.unbind('remove', this.render);
    this.model.unbind('remove', this.onRemove);
    this.model.unbind('reset', this.render);
    this.model.unbind('addItemsSuccess', this.onAddSuccess);
    this.model.unbind('removeItemsSuccess', this.onRemoveSuccess);
    this.model.unbind('error', this.onError);
    //this.model.bind('change', this.render, this);
  },

  render: function() {
    this.renderCollection();
    return this;
  },

  renderCollection: function() {
    // handle this in models that extend this one to support views for each item
    this.$('[data-content="collection"]').html(this.listTemplate({collection: this.model.toJSON()}));
  },

  removeItem: function(eventObj) {
    this.model.removeItems([$(eventObj.currentTarget).parent(['data-id']).data('id')]);
  },

  loadMore: function(eventObj) {
    var self=this,
        $targ = $(eventObj.currentTarget).addClass('loading');
    self.model.loadMore({
      success: function() {
        self.render();
        $targ.removeClass('loading');
      },error:function (argument) {
        $targ.remove();
      }
    });
  },

  sort: function(eventObj) {
    var sortObj = {
      ascsort: $(eventObj.target).data('ascsort') || '',
      descsort: $(eventObj.target).data('descsort') || '',
    };
    // set ajax loader on collection element
    this.model.ajaxSort(sortObj);
  },

  filter: function(eventObj) {
    this.model.ajaxFilter($(eventObj.target).data('filter'));
  },

  onRemove: function(resp) {
  },

  onAdd: function(resp) {
  },

  onError: function(data) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error']});
  },
});

/* Explore bar view */
Scratch.ExploreBar = Scratch.CollectionView.extend({
  events: function() {
    return _.extend({}, Scratch.CollectionView.prototype.events, {
      'click [data-control="open"]' : 'openBar',
      'click [data-control="close"]' : 'closeBar',
      'click #explore-buttons': 'stopEvent',
      'click [data-control="next"]' : 'next',
      'click [data-control="prev"]' : 'prev',
      'click [data-control="draggable"]':'itemClicked',
      'click [data-control="open-explore-bar"]':'openBar'
    });
  },

  initialize: function(options) {
    Scratch.CollectionView.prototype.initialize.apply(this, [options]);
    this.model.unbind('add'); // don't render everytime an individual item is added to the model collection, instead batch render on load
    this.$scrollArea = this.$('.carousel-inner ul');
    this.$arrowLeft = this.$('.arrow-left');
    this.$arrowRight = this.$('.arrow-right');
    _.bindAll(this, 'openBar', 'preLoadSuccess', 'preLoadError');

    Scratch.EventMgr=Scratch.EventMgr||_.extend({}, Backbone.Events);
    Scratch.EventMgr.on('explore-open', this.openBar, this);
  },

  render: function() {
    Scratch.CollectionView.prototype.render.apply(this);
    // recalculate scrollable area
    this.$items = this.$('.carousel-inner li');
    this.$scrollArea.width(this.$items.outerWidth(true)*this.model.length);
    this.scrollPageWidth = this.$('.carousel-inner').width() + parseInt(this.$items.css('padding-right'), 10) - 10;
    this.scrollMax = this.$scrollArea.width() - this.scrollPageWidth;
    // this.initializeDraggable();
  },

  next: function () {
    if (this.sliding) return
    return this.slide('next')
  },

  prev: function () {
    if (this.sliding) return
    return this.slide('prev')
  },

  toggleArrows: function(newPos) {
    if(newPos <= 0) {
      this.$arrowLeft.addClass('off').removeClass('on');
      return;
    } else if (newPos >= this.scrollMax) {
      this.$arrowRight.addClass('off').removeClass('on');
      return;
    }
    this.$arrowRight.removeClass('off').addClass('on');
    this.$arrowLeft.removeClass('off').addClass('on');
  },

  slide: function (type) {
    var newPos;
    if (type == 'start') {
      newPos = 0;
    } else {
      var curPos = this.$('.carousel-inner').scrollLeft();
      var increment = type == 'next' ? this.scrollPageWidth : - this.scrollPageWidth;
      newPos = curPos + increment;
    }

    this.toggleArrows(newPos);
    this.sliding = true;
    this.$('.carousel-inner').animate({
      scrollLeft: newPos,
    }, 800, 'swing', $.proxy(function() {
      this.sliding = false;
      this.preLoad(newPos);
    }, this));
      return this
  },

  preLoad: function(newPos) {
    if (!this.model.hasMore) return;
    if(newPos >= (this.scrollMax - this.scrollPageWidth)) {
      this.$('.carousel-inner').addClass('loading');
      this.model.loadMore({success: this.preLoadSuccess, error: this.preLoadError})
    }
  },

  preLoadSuccess: function(model, response, options) {
    this.render();
    this.$('.carousel-inner').removeClass('loading');
  },

  preLoadError: function(model, response, options) {
    this.$('.carousel-inner').removeClass('loading');
  },

  openBar: function() {
    //this.$('[data-content="view"]').html(this.currentView.el);
    $('body').addClass('explore-bar-visible');
    this.$('#related-projects').animate({height: '160px'});
    this.$('#explore-header').attr('data-control', 'close');
    this.$('#explore-header-open').removeClass('hidden');
    this.$('#explore-header-closed').addClass('hidden');
    this.$('.carousel-control').css('display', 'inline');
    this.model.fetch();
    this.isOpenBar = true;
  },

  closeBar: function() {
    $('body').removeClass('explore-bar-visible');
    $('#related-projects').animate({height: '0px'});
    this.$('#explore-header').attr('data-control', 'open');
    $('#explore-header-closed').removeClass('hidden');
    $('#explore-header-open').addClass('hidden');
    this.$('.carousel-control').css('display', 'none');
    this.isOpenBar = false;
  },

  stopEvent: function(e) {
    // prevent event from bubbling further
    e.stopPropagation();
  },

  open: function() {
    this.model.fetch();
    this.delegateEvents() /* rebind all events for the current tab view */
  },

  // overwrite filter so that we can reposition carousel at 0 (start) when switching to a diff filter
  filter: function(e) {
    Scratch.CollectionView.prototype.filter.apply(this, [e]);
    this.$('.carousel-inner').scrollLeft(0);
  },

  itemClicked:function (e) {
    e.preventDefault();
    Scratch.EventMgr.trigger('explore-item-clicked',$(e.currentTarget).data());
  }

});



/* Counter on a collection (can be seeded or not. seeded is useful when the
 * collection contains more elements to be loaded */
Scratch.CollectionCountView = Backbone.View.extend({

  initialize: function(options) {
    this.template = _.template($('#template-collection-count').html()),
    this.count = options.count || null;
    this.model.bind('add', this.add, this);
    this.model.bind('remove', this.remove, this);
    this.model.bind('reset', this.render, this);
    this.model.bind('change', this.render, this);
  },

  render: function() {
    count = this.count? this.count : this.model.length;
    this.$el.html(this.template({count: count}));
  },

  add: function() {
    count = this.count++ || this.model.length;
    this.render();
  },

  remove: function() {
    count = this.count-- || this.model.length;
    this.render();
  },

});


/* Loads and unloads views from a given array */
Scratch.ViewManager = Backbone.View.extend({

  initialize: function(options) {
    this.views = options.views;
  },

  /* If you pass in a non-existant view, it's the equivalent of showing an empty view */
  swapView: function(view) {
    if (this.currentView) {
      this.currentView.close(); /* unbind all events for the current view */
    }
    this.currentView = this.views[view];
    /* Show the new view if it is valid/ exits, otherwise show nothing */
    if (this.currentView) {
      this.currentView.open();
      this.$('[data-content="view"]').html(this.currentView.el);
    } else {
      this.$('[data-content="view"]').html('');
    }

   this.trigger('swapped', view);
  },

});


/* Tab based view manager */
Scratch.TabsView = Scratch.ViewManager.extend({

  events: {
    'click [data-control="tab"]': 'switchTab',
  },

  switchTab: function(e) {
    // switch tab menu
    var $newTab = $(e.target.parentNode);
    this.$('[data-control="tab"]').removeClass('active');
    $newTab.addClass('active');

    // switch tab content
    this.swapView($newTab.data('tab'));
  },

  selectTab: function(tab) {
    this.$('[data-tab]').removeClass('active');
    this.$('[data-tab="' + tab + '"]').addClass('active');
    this.swapView(tab);
  },

});

Scratch.LogoutView = Backbone.View.extend({
  events: {
    'submit form': 'logout',
  },

  logout: function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: '/accounts/logout/',
      success: function (data, status, xhr) {
        window.location.href = '/';
      }
    });
  }
});

Scratch.LoginView = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this, 'onLoginSuccess', 'onLoginError');
  },

  events: {
    'submit form': 'login',
    'click .dropdown-menu': 'formClick',
  },

  formClick: function(e) {
    // prevent clicking on form from closing dorpdown
    e.stopPropagation();
  },

  login: function(e) {
    e.preventDefault();// prevent form submit
    this.$('button').hide();
    this.$('.ajax-loader').show();
    // needs better error handling

    // handles captcha info - redirect from login dropdown,
    // embed captcha in login dialog.
    if(this.$el.is('#login-dialog') && typeof this.recaptchaWidget !== 'undefined') {
      var embed_captcha = true;
      var recaptcha_response = grecaptcha.getResponse();
    } else {
      var embed_captcha = false;
      var recaptcha_response = '';
    }
    $.withCSRF(function( csrf_token) {
      this.model.login({
        username: this.$('[name="username"]').val(),
        password: this.$('[name="password"]').val(),
        "g-recaptcha-response": recaptcha_response,
        embed_captcha: embed_captcha,
        timezone: jstz.determine().name(),
        csrfmiddlewaretoken: csrf_token,
      }, {
        success: this.onLoginSuccess,
        error: this.onLoginError
      });

    }.bind(this));
  },

  onLoginSuccess: function(model, xhr) {
    Scratch.LoggedInUser.set(this.model.attributes);
    if(this.$el.is('#login-dialog')) { // modal
      if(location.href.indexOf('editor')<0 && location.href.indexOf('pathways') < 0) // are we in player or editor?
        location.reload(); //player, reload the page
      else {
        this.$el.modal('hide'); //editor, the swf handles it
        setAccountNavFromJson(); // see account-nav.js – reloads Scratch.INIT_DATA
      }
    }
    else { // dropdown
      this.$el.removeClass('open');
      location.reload();
    }
  },

  onLoginError: function(model, xhr) {
    if (xhr.status === 400) {
      // Already logged in
      return this.onLoginSuccess(model, xhr);
    }
    var responseJSON = xhr.responseJSON[0] || {msg: 'An unknown error occurred'};
    if ('redirect' in responseJSON) {
      if (this.$el.is('#login-dialog')) {
        if (typeof this.recaptchaWidget === 'undefined') {
            this.recaptchaWidget = grecaptcha.render('recaptcha-container');
        } else {
            grecaptcha.reset(this.recaptchaWidget);
        }
        this.$('.error').html(responseJSON.msg).show();
        this.$('button').show();
        this.$('.ajax-loader').hide();
        this.model.currentLoginUrl = this.model.loginRetryUrl;
      } else {
        window.location = responseJSON.redirect;
      }
    } else {
      this.$('.error').html(responseJSON.msg).show();
      this.$('button').show();
      this.$('.ajax-loader').hide();
    }
  },

});


Scratch.LanguageDropdownView = Backbone.View.extend({
  events: {
    'change #language-selection': 'changeLanguage',
  },


  changeLanguage: function(e) {
    var self = this;
    $.withCSRF(function(csrf_token) {
      $('<input>').attr({
          type: 'hidden',
          name: 'csrfmiddlewaretoken',
          value: csrf_token,
      }).prependTo(self.$el);
      self.$el.submit();
    });
  },

});

Scratch.AlertView = Backbone.View.extend({

  className: 'alert fade in',
  alerts: ['success', 'error', 'info'],
  template: _.template(['<span class="close">&times;</span>',
                        '<%= message %>'].join('')),

  events: {
    'click .close': 'closeAlert',
  },

  initialize: function(options) {
    var message = options.msg || '';
    var alert = options.hasOwnProperty('alert')? options.alert : 'info';
    var timer = options.timer===undefined ? 3000 : options.timer;
    var memory = options.memory||false;
    if (_.indexOf(this.alerts, alert) === -1) {
      throw new Error('Invalid alert: [' + alert + '] Must be one of:' +
        this.alerts.join(', '));
    }
    this.alert = alert;
    this.message = message;
    this.timer = timer;
    this.memory = memory;

    _.bindAll(this, 'closeAlert');
  },

  render: function() {
    var output = this.template({ message: this.message }),
    $elem = this.$el.addClass('alert-' + this.alert).html(output).show();
    if(this.timer) $elem.delay(this.timer).fadeOut('slow'); // jquery plugin
    return this
  },

  closeAlert: function(e) {
    this.$el.stop().fadeOut('fast');
  },
});

Scratch.AlertView.msg = function($el, options) {
  var alert = new Scratch.AlertView(options),
  width = $el.html(alert.render().el).width();
  $el.css({'marginLeft': -width/2, 'left': '50%'}); // center on page
  return alert;
};

Scratch.Comments = Backbone.View.extend({
  page: 0,

  events: {
   'click [data-control="load-more"]' : 'getNextPage',
   'click [data-control="post"]' : function(e) {
        this.hideError(e);
        this.postComment(e);
   },
   'click [data-control="reply-to"]' : 'showReplyForm',
   'click [data-control="cancel"]' : 'cancel',
   'click [data-control="delete"]' : 'deleteComment',
   'click [data-control="undelete"]' : 'undeleteComment',
   'click [data-control="report"]' : 'report',
   'click [data-control="unreport"]' : 'unreport',
   'click .more-replies': 'showMoreReplies',
   'focus #comments textarea': 'hideError',
   'change #comments-enabled': 'toggleComments',
   'hover .tenmil': 'confetti'
  },

  initialize: function(options) {
    this.type = options.type;
    this.typeId = options.typeId;
    this.gaqType = this.type=='user'?'profile':this.type=='gallery'?'studio':this.type;

    // do not intialize comments if they are disabled sitewide for this comment type
    var commentsAllowed = false;
    if (this.type == "project") {
      commentsAllowed = Scratch.INIT_DATA.project_comments_enabled;
    } else if (this.type == "user") {
      commentsAllowed = Scratch.INIT_DATA.userprofile_comments_enabled;
    } else if (this.type == "gallery") {
      commentsAllowed = Scratch.INIT_DATA.gallery_comments_enabled;
    }
    if (commentsAllowed === false) return;

    this.commentPostingAllowed = $('#main-post-form').is(':visible');

    this.student_usernames = [];
    if (Scratch.INIT_DATA.LOGGED_IN_USER.model && Scratch.INIT_DATA.LOGGED_IN_USER.model.is_educator) {
      var students = new Scratch.UserThumbnailCollection([], {
        url: '/site-api/classrooms/students/of/' + Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
        model: Scratch.UserThumbnail
      });
      this.gotStudents = $.Deferred();
      var fetchStudents = function (page) {
        if (typeof page === 'undefined') page = 1;
        return students
            .fetch({url: students.options.url, data: {page: page}, add: true})
            .then(function (response) {
                return fetchStudents(page+1);
            }.bind(this))
            .fail(function () {
                this.student_usernames = students.models.map(function (student) {
                    return student.get('user').username;
                });
                this.gotStudents.resolve();
            }.bind(this));
      }.bind(this);
      fetchStudents();
    } else {
      this.gotStudents = $.Deferred(function(d){d.resolve()});
    }

    this.commentReplyTemplate = _.template($('#template-comment-reply').html());

    if (Scratch.INIT_DATA.IS_SOCIAL) {
      // enable limit count on main post box
      this.$('#main-post-form textarea').limit('500', '#chars-left');
      this.$('#main-post-form textarea').keydown(function (e) {
        if (e.ctrlKey && (e.keyCode == 13 || e.keyCode == 10)) {
          // Ctrl-Enter pressed
          this.postComment(e);
        }
      });
    } else {
      this.$('#main-post-form textarea').limit('0');
      this.$('#main-post-form textarea').focus(function() {
        openResendDialogue(); //see global.js for function definition
      });
    }

    this.$commentContainer = $('<div>');

    if(options.scrollTo){// if a comment is specified
      this.scrollTo('.comments'); // ensure we're looking at the comments section
      this.getNextPage( '#comments'+options.scrollTo); // and load the comments;
    } else{
      this.getNextPage();
    }
  },

  hideError: function() {
    this.$('.control-group.tooltip').removeClass('error');
  },

  render: function() {
    var $commentsParent = this.$('[data-content="comments"]');
    $commentsParent.find('#comments-loading').remove();
    $commentsParent.append(this.$commentContainer.html());
    this.$commentContainer.html('');

    //Add comment count
    if (this.type == 'project') {
      var count = $('[data-control-comment-count]').attr('data-control-comment-count') || "";
      if (count.length == 0)
        count = "0";
      $('#comment-count').text('(' + count + ')');
    }
  },

  confetti: function(e) {
    if (window.confettiRunning) {
      return;
    } else {
      window.confettiRunning = true;
    }
    $('#content').confetti({
      x: e.pageX,
      y: e.pageY,
      complate: function() { window.confettiRunning = false; }
    });
  },

  getNextPage: function(scrollToIdSelector) {
    this.$('[data-control="load-more"]').remove();
    var self = this;

    var admin_comment_path = '';
    if (Scratch.INIT_DATA.ADMIN) {
        admin_comment_path = 'with-deleted/';
    }

    self.page++;
    return $.ajax({
      url: '/site-api/comments/' + admin_comment_path + this.type + '/' + this.typeId + '/?page=' + this.page,
    }).done(function(data) {
      // after comments are loaded scroll to comment if defined
      if(self.page > 40) throw "more than 40 pages of comments shouldn't be happening";
      self.$commentContainer.append(data);
      if(!scrollToIdSelector || scrollToIdSelector instanceof($.Event)){ // no comment specified, or "load more" clicked
        self.render();
        self.$("span.time").timeago();
      } else if (data.indexOf(scrollToIdSelector.slice(1)) > -1){ // if comment is in current page.
        self.render(); // render the queue
        self.$("span.time").timeago();
        setTimeout(function () { // once render finishes...
          self.scrollTo(scrollToIdSelector); // scroll to the comment.
        },0);
      } else { // comment exists in another page - load next
        self.$commentContainer.find('[data-control="load-more"]').remove();
        self.getNextPage(scrollToIdSelector);
      }

      self.showCommentOptions();
    });
  },

  showCommentOptions: function($element) {
    if (!Scratch.INIT_DATA.LOGGED_IN_USER.options.authenticated)
      return;
    if (Scratch.INIT_DATA.ADMIN)
      return;

    $element = $element || this.$el;
    var self = this;

    var can_delete = false;
    var comments_allowed = false;
    if (Scratch.INIT_DATA.ADMIN) {
      can_delete = true;
    }
    if (self.type == "project") {
      if (Scratch.INIT_DATA.PROJECT.model.creator == Scratch.INIT_DATA.LOGGED_IN_USER.model.username)
        can_delete = true;
      comments_allowed = Scratch.INIT_DATA.PROJECT.model.comments_allowed && Scratch.INIT_DATA.project_comments_enabled;
    } else if (self.type == "user") {
      if (Scratch.INIT_DATA.PROFILE.model.username == Scratch.INIT_DATA.LOGGED_IN_USER.model.username)
        can_delete = true;
      comments_allowed = Scratch.INIT_DATA.PROFILE.model.comments_allowed && Scratch.INIT_DATA.userprofile_comments_enabled;
    } else if (self.type == "gallery") {
      if (Scratch.INIT_DATA.GALLERY.model.is_owner) {
        can_delete = true;
      }
      comments_allowed = Scratch.INIT_DATA.GALLERY.model.comments_allowed && Scratch.INIT_DATA.gallery_comments_enabled;
    }

    $.when(this.gotStudents).then(function() {
      $element.find('div.comment').each(function() {
        var comment_info = {
          can_delete: can_delete,
          current_user: Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
          comment_user: $(this).find('#comment-user').data('comment-user'),
          type: self.type,
          is_staff: Scratch.INIT_DATA.ADMIN
        };
        comment_info['student_of_educator'] = self.student_usernames.indexOf(comment_info.comment_user) >= 0;
        var template = _.template($('#template-comment-actions').html());
        $(this).find('.actions-wrap').html(template(comment_info));

        // Set up reply
        $(this).find('a.reply').attr('data-control', 'reply-to');
        if (comments_allowed && self.commentPostingAllowed)
          $(this).find('a.reply').css('display', 'inline');
      });
    });
  },

  postComment: function(e) {
    e.preventDefault();
    var $postBtn = $(e.currentTarget),
        $commentForm = $postBtn.closest('form'),
        content = $.trim($commentForm.find('textarea').val()),
        commentData = {content: content, parent_id: $postBtn.data('parent-thread') || '', commentee_id: $postBtn.data('commentee-id') || ''},
        isReply = false,
        self = this;

    if (commentData.parent_id) {
      isReply = true;
    }

    var showCommentError = function(errorText, isMuteMessage) {
        if (typeof isMuteMessage == 'undefined') isMuteMessage = false; // default to false

        $commentForm.find('[data-control="error"] .text').html(errorText);
        $commentForm.find('[data-control="info"]').hide()
        $commentForm.find('.control-group').addClass('error');

        // if this is a mute-related error, add an addition class so that it can be styled differently
        if(isMuteMessage) {
          $commentForm.find('.control-group').addClass('mute');
        }
    };

    var messageWithDuration = function(message, futureTime) {
      // given a message and a time in the future, interpolate the message with a formated relative time
      var relativeTime = formatRelativeTime(futureTime, getCookie('scratchlanguage'));
      return interpolate(message, {"duration": relativeTime}, true);
    }

    var mutingMessage = function(messageType, expiresAt) {
      // show the correct muting message based on the message type
      var durationMessage = messageWithDuration(gettext(Scratch.ALERT_MSGS['comment-muted-duration']), expiresAt);
      var typeMessage;

      if (messageType == 'pii') {
        typeMessage = gettext(Scratch.ALERT_MSGS['comment-pii-message'])
      } else if (messageType == 'unconstructive') {
        typeMessage = gettext(Scratch.ALERT_MSGS['comment-unconstructive-message'])
      } else if (messageType == 'vulgarity') {
        typeMessage = gettext(Scratch.ALERT_MSGS['comment-vulgarity-message'])
      } else if (messageType == 'spam') {
        typeMessage = gettext(Scratch.ALERT_MSGS['comment-spam-message'])
      } else {
        typeMessage = gettext(Scratch.ALERT_MSGS['comment-bad-general-message'])
      }

      showCommentError(typeMessage + " " + durationMessage, true);
    }

    var constructErrorMessage = function(errorData) {
        var errorType = errorData.error;
        if (errorType == 'isBad') {
          if (typeof errorData.mute_status != 'undefined') {
            mutingMessage(errorData.mute_status.currentMessageType, errorData.mute_status.muteExpiresAt * 1000);
            return;
          }
          else {
            showCommentError(gettext(Scratch.ALERT_MSGS['inappropriate-comment']));
            _gaq.push(['_trackEvent', self.gaqType, 'comment_rejected:bad_word', ]);
          }
            return;
        } else if (errorType == 'hasChatSite') {
            showCommentError(gettext(Scratch.ALERT_MSGS['comment-has-chat-site']));
            _gaq.push(['_trackEvent', self.gaqType, 'comment_rejected:chat_site', ]);
            return;
        } else if (errorType == 'isSpam') {
            showCommentError(gettext(Scratch.ALERT_MSGS['comment-spam']));
            return;
        } else if (errorType == 'isFlood') {
            showCommentError(gettext(Scratch.ALERT_MSGS['comment-flood']));
            return;
        } else if (errorType == 'isMuted') {
            if (typeof errorData.mute_status != 'undefined') {
                var muted = messageWithDuration(gettext(Scratch.ALERT_MSGS['comment-muted-duration']), errorData.mute_status.muteExpiresAt * 1000);
                showCommentError(muted, true);
            }
            else {
                showCommentError(gettext(Scratch.ALERT_MSGS['comment-muted']));
            }
            return;
        } else if (errorType == 'isUnconstructive') {
            showCommentError(gettext(Scratch.ALERT_MSGS['comment-unconstructive']));
            return;
        } else if (errorType == 'isDisallowed') {
            showCommentError(gettext(Scratch.ALERT_MSGS['comment-disallowed']));
            return;
        } else if (errorType == 'isIPMuted') {
            // in case they manipulate javascript, the backend catches muted IPs
            $('#ip-mute-ban').modal();
            return;
        } else if (errorType == 'isEmpty') {
            // in case the comment was only four-byte unicode characters and was cleaned to emtpy
            showCommentError(gettext(Scratch.ALERT_MSGS['error']));
        } else if (errorType == 'isTooLong') {
            return;
        }

        // fallback case
        showCommentError(gettext(Scratch.ALERT_MSGS['error']) + '<hr>' + errorType)
    }

    // don't allow muted IPs to post
    if (Scratch.INIT_DATA.IS_IP_BANNED) {
        $('#ip-mute-ban').modal();
        return;
    }

    // don't allow posting empty comments
    if (content == "") {
      showCommentError(Scratch.ALERT_MSGS['empty-comment']);
      return;
    }

    // update the button style to indicate submitting
    $postBtn.removeAttr('data-control').addClass('posting');
    // send comment post
    $.ajax({
        type: "POST",
        dataType: 'html',
        data: JSON.stringify(commentData),
        url: '/site-api/comments/' + this.type + '/' + this.typeId + '/add/',
    }).done(function(data) {
        // if there is a comment error, get data about the error and show a message
        var errorTag = $(data).filter('#error-data');
        if (errorTag.length > 0) {
          var errorData = JSON.parse(errorTag.text());
          return constructErrorMessage(errorData);
        }

        // if there is no error, post the comment
        _gaq.push(['_trackEvent', self.gaqType, 'comment_add']);
        var $li = $('<li></li>');
        if (isReply) {
          self.$('[data-thread="' + commentData.parent_id + '"]').append($li.html(data));
          $postBtn.closest('[data-content="reply-form"]').html('');
        } else {
          $postBtn.closest('form').find('textarea').val('').end().find('#chars-left').html('500');
          self.$('[data-content="comments"]').prepend($li.html(data + '<ul class="replies" data-thread="' + $(data).data('comment-id') + '"></ul>'));
        }
        self.scrollTo(null,$li);// scroll to the reply if it appears out of the visual window
        self.$("span.time").timeago();
        self.showCommentOptions($li);
    }).error(function(data) {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error'] });
    }).always(function(data) {
        $postBtn.attr('data-control','post').removeClass('posting');  // restore the post buttons after success or error
    });
  },

  showReplyForm: function(e) {
    if (!this.commentPostingAllowed) return;

    var $replyToBtn = $(e.currentTarget),
        self=this,
        $li = $replyToBtn.closest('li');

    function showForm(){
      var replyForm = $li.find('[data-content="reply-form"]:first')
        .html(self.commentReplyTemplate({
          thread_id: $replyToBtn.data('parent-thread'),
          commentee_id: $replyToBtn.data('commentee-id'),
          comment_id: $replyToBtn.data('comment-id')
        }));
      if (Scratch.INIT_DATA.IS_SOCIAL) {
        // enable limit count on main post box
        replyForm.find('textarea')
          .focus()
          .limit('500', '#chars-left-' + $replyToBtn.data('comment-id'));

      } else {
        replyForm.find('textarea').limit('0');
        replyForm.find('textarea').focus(function() {
          openResendDialogue(); //see global.js for function definition
        });
      }
    }

    this.showMoreReplies({
      useAnimation:$li.closest('.top-level-reply').find('.truncated').length, // if is a comment with replies, use animation
      $elem:$li,
      callback:showForm
    });

  },

  cancel: function(e) {
    e.preventDefault();
    // cancel comment post
    $(e.currentTarget).parents('form:first').find('textarea')[0].value="";
    $(e.currentTarget).parents('form:first').find('#chars-left').html('500');
    $(e.currentTarget).parents('[data-content="reply-form"]:first').empty(); // if it's a reply remove the form
  },

  submitDelete:function (e) {
    var $comment = $(e.currentTarget).closest('[data-comment-id]'),
        cid = $comment.attr('data-comment-id');

    $.ajax({
      url: '/site-api/comments/' + this.type + '/' + this.typeId + '/del/',
      type: 'POST',
      dataType: 'html',
      data: JSON.stringify({id: cid}),
    }).done(function(data){
      // show the comment as removed, TODO: should the behaviour be different if it's censored?
      $comment.parent('li').remove();
      _gaq.push(['_trackEvent', self.gaqType, 'comment_deleted']);
    });
  },

  deleteComment: function(e) {
    var self=this;

    if(Scratch.INIT_DATA.ADMIN) return self.submitDelete(e);

    this.deleteDialogElem = this.deleteDialogElem || $(Scratch.ALERT_MSGS.delete_comment);

    this.deleteDialogElem.dialog({
      buttons: {
        Cancel: function() {
          $( this ).dialog( "close" );
        },
        "Delete": function() {
          $( this ).dialog( "close" );
          self.submitDelete(e);
        },
        Report: function() {
          $( this ).dialog( "close" );
          self.submitReport(e);
        }
      }
    });
  },

  undeleteComment: function(e) {
      // allow admins to undo report
    var $comment = $(e.currentTarget).closest('[data-comment-id]'),
        cid = $comment.attr('data-comment-id'),
        self=this;

    $.ajax({
       url: '/site-api/comments/' + this.type + '/' + this.typeId + '/undel/',
       type: 'POST',
       dataType: 'html',
       data: JSON.stringify({id: cid}),
    }).done(function(data){
       // put the comment back
       $comment.replaceWith(data);
       $("#comments-"+cid).removeClass("removed");
       $("#comments-"+cid).parents("li").removeClass("removed");
       _gaq.push(['_trackEvent', self.gaqType, 'comment_undelete']);
    });
  },

  report: function(e) {
    var self=this;
    if(Scratch.INIT_DATA.ADMIN) return self.submitReport(e);

    var comment_user = $(e.currentTarget).closest('[data-comment-id]').find("#comment-user").data('comment-user');
    var student_of_educator = self.student_usernames.indexOf(comment_user) >= 0;
    var dialogButtons = {
     Cancel: function() {
        $( this ).dialog( "close" );
      },
      Report: function() {
        $( this ).dialog( "close" );
        self.submitReport(e);
      }
    }

    if (student_of_educator) {
      this.educatorReportDialog = this.educatorReportDialog ||  $(Scratch.ALERT_MSGS.report_comment_educator);
      this.reportDialogElem = this.educatorReportDialog;
      dialogButtons["Delete"] = dialogButtons["Report"];
      delete dialogButtons["Report"];
    } else {
      this.reportDialog = this.reportDialog || $(Scratch.ALERT_MSGS.report_comment);
      this.reportDialogElem = this.reportDialog;
    }

    this.reportDialogElem.dialog({buttons: dialogButtons});
  },

  submitReport: function(e) {
    var $comment = $(e.currentTarget).closest('[data-comment-id]'),
        cid = $comment.attr('data-comment-id');


     $.ajax({
      url: '/site-api/comments/' + this.type + '/' + this.typeId + '/rep/',
      type: 'POST',
      dataType: 'html',
      data: JSON.stringify({id: cid}),
    }).done(function(data){
      // show the comment as removed, TODO: should the behaviour be different if it's censored?
      $comment.replaceWith(data);
      _gaq.push(['_trackEvent', self.gaqType, 'comment_report_add']);
    });
  },

  unreport: function(e) {
      // allow admins to undo report
    var $comment = $(e.currentTarget).closest('[data-comment-id]'),
        cid = $comment.attr('data-comment-id'),
        rid = $(e.currentTarget).data('report-id'),
        self=this;

    $.ajax({
       url: '/site-api/comments/' + this.type + '/' + this.typeId + '/unrep/',
       type: 'POST',
       dataType: 'html',
       data: JSON.stringify({id: cid, rid: rid }),
    }).done(function(data){
       // put the comment back
       $comment.replaceWith(data);
       _gaq.push(['_trackEvent', self.gaqType, 'comment_report_remove']);
    });
  },

  scrollTo:function (scrollToIdSelector, $optionalElem) {
    // scrollToIdSelector is of the form #comments-134398
    // $optionalElem is an jQuery-wrapped element to scroll to
    if (!scrollToIdSelector && !$optionalElem) return;
    var $comment = $optionalElem||this.$(scrollToIdSelector);
    if ($comment.length === 0) throw scrollToIdSelector + ' is non-existent.';
    var $li = $comment.closest('li');

    // highlight the comment
    $li.addClass('highlighted');

    // if comment is hidden show it
    if (!$comment.is(":visible") && Scratch.INIT_DATA.ADMIN) $('#comments .removed').toggle();

    if ($li.hasClass('truncated')){
      this.showMoreReplies({
        $elem:$li,
        useAnimation:false
      });
    }

    // scroll page down to show the comment in question
    var $w=$(window)
    ,wHeight=$w.height()
    ,wTop=$w.scrollTop()
    ,wBottom=wTop+wHeight
    ,cHeight = $comment.outerHeight(true)
    ,cTop=$comment.offset().top
    ,cBottom=cTop+cHeight
    ,scrollPos = cTop - wHeight/2 + cHeight/2
    ,scrollTime = scrollPos/2;

    if(cTop < wTop || cBottom > wBottom){ // if the comment isn't completely visible
      return $('html,body').animate({scrollTop: scrollPos}, scrollTime>1000 ? 1000 : scrollTime ).promise(); // animate to it
    }
  },

  showMoreReplies:function (options) {
    var o = options||{},
        $threadParent,
        $expandButton,
        $truncatedElems;

    if(o.currentTarget){ // working with "show more replies" button click event
      $expandButton = $(o.currentTarget);
      $threadParent = $expandButton.closest('.top-level-reply').find('.replies');
      o.useAnimation=true;
    } else{ // working with a reply click, scrolling to a comment, or something else. Assume o.$elem passed.
      $threadParent = o.$elem.closest('.top-level-reply').find('.replies');
      $expandButton = $threadParent.next('.more-replies');
    }
    $truncatedElems = $threadParent.find('.truncated');

    if(o.useAnimation){
      $expandButton.slideUp('fast');
      var $lastVisible = $truncatedElems.first().prev('.lastvisible');
      $lastVisible.animate({height:$lastVisible.children(':first').outerHeight()},'fast');
      $truncatedElems.slideDown('fast').promise()
      .always(function(){
        removeTruncated();
        $lastVisible.height('');
      });
    } else{
      removeTruncated();
    }

    function removeTruncated(){
      $truncatedElems.first().prev().removeClass('lastvisible');
      $truncatedElems.removeClass('truncated');
      $expandButton.remove();
      if(o.callback) o.callback();
    };
  },

  toggleComments: function(evt) {
    var $checkbox = $(evt.target);
    var $commentsOff = this.$('.comments-off');
    var $commentsOn = this.$('.comments-on');
    var $commentReply = this.$('[data-content="reply-form"]');
    var $commentReplyButtons = this.$('.reply[data-control="reply-to"]');
    var is_being_checked = $checkbox.is(':checked');
    var commentingDisabled = function() {
        // show disabled message
        $commentsOff.show();
        // hide comment reply
        $commentsOn.hide();
        // hide reply buttons and box
        $commentReply.hide();
        $commentReplyButtons.hide();

    };
    var commentingEnabled = function() {
        // hide disabled message
        $commentsOff.hide();
        // show comment box
        $commentsOn.show();
        // show reply buttons and box
        $commentReply.show();
        $commentReplyButtons.show();
    }
    if (is_being_checked) {
        commentingDisabled();
    } else {
        commentingEnabled();
    }
    $.post(
        '/site-api/comments/' + this.type + '/' + this.typeId + '/toggle-comments/',
        {}
    ).fail(function(data) {
        // reset things back to correct state
        if (is_being_checked) {
            commentingEnabled();
            $checkbox.removeAttr('checked');
        } else {
            commentingDisabled();
            $checkbox.attr('checked', 'checked');
        }
    });
  }

});


/* Manages swapping out views in one particular element */
Scratch.ViewController = Backbone.View.extend({
  showView: function(view) {
    if (this.currentView) {
      this.currentView.close();
    }

   this.currentView = view;
   if (this.currentView) { // check if it exists, since view can be Null in order to remove the view
     this.currentView.render();
     this.$el.html(this.currentView.el);
   }

  },
});

/* Follow button */
Scratch.FollowButton = Backbone.View.extend({
  events: {
   'click [data-control="follow"]' : 'follow',
   'click [data-control="unfollow"]' : 'unfollow',
  },

  initialize: function(options) {
    _.bindAll(this, 'followed');
    _.bindAll(this, 'unfollowed');
    this.displayName = options.displayName;
  },

  follow: function() {
    this.model.related.followers.addItems(Scratch.LoggedInUser.get('username'), {success: this.followed, error: this.onFollowError});
  },

  followed: function(response, model) {
    this.$('[data-control="follow"]').removeClass('blue notfollowing').addClass('grey following').attr('data-control', 'unfollow');
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['followed'] + this.displayName });
    _gaq.push(['_trackEvent', 'studio', 'follow_add' ]);
  },

  onFollowError: function(response, model) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: response.responseJSON[0].errors.join(',') });
  },

  unfollow: function() {
    this.model.related.followers.removeItems(Scratch.LoggedInUser.get('username'), {success: this.unfollowed});
  },

  unfollowed: function(response, model) {
    this.$('[data-control="unfollow"]').removeClass('grey following').addClass('blue notfollowing').attr('data-control', 'follow');
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['unfollowed'] + this.displayName });
    _gaq.push(['_trackEvent', 'studio', 'follow_remove' ]);
  },
});


Scratch.EditableTextField = Backbone.View.extend({
  events: {
    'focusout textarea' : 'saveEditable',
    'focusout input' : 'saveEditable',
    'click': 'edit',
    'submit form': 'preventFormSubmit',
  },

  initialize: function(attributes, options) {
    _.bindAll(this, 'success', 'error', 'saveEditable');
    this.$eField=this.$('input, textarea');
    this.eField=this.$eField[0];
  },


  saveEditable: function(e) {
    // if the content of the editable field changed, do stuff, otherwise do nothing.
    if (this.eField.value != this.eField.defaultValue) {
      var changes = {};
      changes[this.eField.name] = this.eField.value;
      this.serverCall(changes);
      if(e.type=='focusout') this.$el.addClass('loading'); // only show the loading gif if we're no longer editing the field
      this.eField.defaultValue = this.eField.value;
    }
    if(e.type=='focusout') {
      clearInterval(this.saveInt); // we're on a focusout event, clear the interval set in this.edit
      this.$el.removeClass('editable-empty').addClass('editable');
      this.$el.addClass('read').removeClass('write');
      if (!this.eField.value) {
        this.$el.addClass('editable-empty').removeClass('editable');
        this.$('[data-content="prompt"]').show();
      }
    }
  },

  serverCall: function(changes) {
    this.model.save(changes, {wait: true, success: this.success, error: this.error});
  },

  edit: function(e) {
    if (!this.$('form').length) return this.undelegateEvents(); // if no form, this isn't editable, so undelegate;
    this.clearPrompt();
    this.$el.removeClass('read').addClass('write');
    this.$eField.focus();
    var self = this;
    clearInterval(this.saveInt);
    this.saveInt = setInterval(function(){
      self.saveEditable(e);
    },10000);
    //this.$('.read').removeClass('read').addClass('write');
  },

  clearPrompt: function() {
   this.$('[data-content="prompt"]').hide();
   this.$eField.focus();

  },

  preventFormSubmit: function(e) {
    e.preventDefault();
    this.saveEditable(e);
  },

  success: function(model, response) {
    this.$el.removeClass('loading');
    if (response.errors) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS[response.errors[0]], timer: 10000 });
      return
    }
    this.onEditSuccess();
  },

  onEditSuccess: function(data) {
    // override this to show custom success message, or do something on success
  },

  error: function(model,xhr,options) {
    // Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: xhr.responseText||xhr.statusText });
    // no visible alert since this fires if the page is unloading, even when there is a server side success.
    throw 'in Scratch.EditableTextField, error - responseText:' + xhr.responseText + '  status:'+xhr.status;
  },


});

Scratch.EditableSelectField = Backbone.View.extend({
  events: {
    'change select' : 'saveEditable',
    //'focusout input' : 'saveEditable',
    //'click': 'edit',
    'submit form': 'preventFormSubmit',
  },

  initialize: function(attributes, options) {
    _.bindAll(this, 'success', 'error', 'saveEditable');
    this.$eField=this.$('select');
    this.eField=this.$eField[0];
  },


  saveEditable: function(e) {
    var changes = {};
    changes[this.eField.name] = this.$('select').val();
    this.serverCall(changes);
  },

  serverCall: function(changes) {
    this.model.save(changes, {wait: true, success: this.success, error: this.error});
  },

  preventFormSubmit: function(e) {
    e.preventDefault();
    this.saveEditable(e);
  },

  success: function(model, response) {
    this.$el.removeClass('loading');
    if(response.isBad) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['inappropriate-generic'], timer: 10000 });
      return
    }
    this.onEditSuccess();
  },

  onEditSuccess: function(data) {
    // override this to show custom success message, or do something on success
  },

  error: function(model,xhr,options) {
    // Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: xhr.responseText||xhr.statusText });
    // no visible alert since this fires if the page is unloading, even when there is a server side success.
    throw 'in Scratch.EditableSelectField, error - responseText:' + xhr.responseText + '  status:'+xhr.status;
  },
});

Scratch.EditableCheckboxField = Backbone.View.extend({
  events: {
    'click [type="checkbox"]': 'saveEditable',
    //'focusout input' : 'saveEditable',
    //'click': 'edit',
    'submit form': 'preventFormSubmit',
  },

  initialize: function(attributes, options) {
    _.bindAll(this, 'success', 'error', 'saveEditable');
    this.$eField=this.$('input[type="checkbox"]');
    this.eField=this.$eField[0];
  },


  saveEditable: function(e) {
    var changes = {};
    changes[this.eField.name] = (this.$eField.is(':checked') ? 1 : 0);
    this.serverCall(changes);
  },

  serverCall: function(changes) {
    this.model.save(changes, {wait: true, success: this.success, error: this.error});
  },

  preventFormSubmit: function(e) {
    e.preventDefault();
    this.saveEditable(e);
  },

  success: function(model, response) {
    this.$el.removeClass('loading');
    if(response.isBad) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['inappropriate-generic'], timer: 10000 });
      return
    }
    this.onEditSuccess();
  },

  onEditSuccess: function(data) {
    // override this to show custom success message, or do something on success
  },

  error: function(model,xhr,options) {
    // Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: xhr.responseText||xhr.statusText });
    // no visible alert since this fires if the page is unloading, even when there is a server side success.
    throw 'in Scratch.EditableSelectField, error - responseText:' + xhr.responseText + '  status:'+xhr.status;
  },
});

Scratch.EditableImage = Backbone.View.extend({

  events: {
    'mouseover': 'showEdit',
    'mouseout': 'hideEdit',
    'change input[type="file"]': 'submit',
  },

  initialize: function() {
    _.bindAll(this, 'imageUploadStart');
    _.bindAll(this, 'imageUploadSuccess');

    this.$el.fileupload({
      url: this.model.url(),
      done: this.imageUploadSuccess,
      start: this.imageUploadStart,
      pasteZone: this.$el
    });
  },

  showEdit: function(e) {
    this.$el.addClass('edit');
  },

  hideEdit: function(e) {
    this.$el.removeClass('edit');
  },

  imageUploadSuccess: function(event,xhr) {
    this.$el.removeClass('loading');
    if (xhr.result.error) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: xhr.result.errors[0]});
    } else if (xhr.result.errors) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS[xhr.result.errors[0]], timer: 10000 });
    } else {
      var new_src = xhr.result.thumbnail_url + '#' + new Date().getTime(); // unique hash param to force refresh
      this.$('img').attr('src', new_src);
      Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['thumbnail-changed']});
    }
  },

  imageUploadStart: function() {
    this.$el.removeClass('edit');
    this.$el.addClass('loading');
  },

  submit: function(e) {
    //this.el.submit();
  },
});
