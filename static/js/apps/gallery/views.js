var Scratch = Scratch || {};
Scratch.Gallery = Scratch.Gallery || {};


Scratch.Gallery.Report = Backbone.View.extend({
  template: _.template($('#template-gallery-report').html()),
  thankyou: _.template($('#template-gallery-thanks').html()),
  $selectables: $('h2, #description textarea, #description .overview, #gallery .img-container'),

  clearSelectedField: function(){
    // Allow the stylesheet to take prescedence
    this.$selectables.css({
      'background-color': '',
      'border': '',
      'border-radius': ''
    });
  },

  initialize: function(options) {
    var model = this.model;
    var template = $(this.template());
    var thankyou = $(this.thankyou());
    var self = this;
    $(document).on('click', '#report_form #radio_title', function() {
      self.clearSelectedField();
      $('h2').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });
    $(document).on('click', '#report_form #radio_description', function() {
      self.clearSelectedField();
      $('#description textarea, #description .overview').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });
    $(document).on('click', '#report_form #radio_thumbnail', function() {
      self.clearSelectedField();
      $('#gallery .img-container').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });

    $('#report-this').click(function() {
      $(template).dialog({
        title: "Report this studio",
        close: function(){ self.clearSelectedField(); },
        open: function(){
          dialog = this;
          $(".ui-widget-overlay").click(function(){$(dialog).dialog("close");})
        },
        buttons: {
          "Send": function(e) {
            var dialog = this;
            var value = $('#report_form input:checked').val();
            if (!value){
              $('.gallery-report form').animate({backgroundColor: "pink"});
              $('.gallery-report .errors').show();
              return false;
            }
            $(e.target).closest('button').button('disable');
            $.post(model.url() + 'report/', {selected_field:value}, function() {
              _gaq.push(['_trackEvent', 'gallery', 'report_add']);
              $(dialog).dialog("close");
              $(thankyou).dialog({
               title: "Thank you",
               buttons: {
                 "OK": function () {
                   $(this).dialog("close");
                 }
               }
              });
            });
          }
        }
      });
    });
  }
});


Scratch.Gallery.ProjectList = Backbone.View.extend({

  events: {
    'click .remove': 'removeProject',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
  },

  removeProject: function(e) {
    var self = this;
    var $project = $(e.target).parents('.project.thumb');
    // show ajax loader if request takes longer than 300ms
    xhrLoaderTimeout = setTimeout(function() {$project.addClass('loading')}, 300);
    $.ajax({
      url: '/site-api/projects/in/' + this.gallery_id + '/remove/?pks=' + $project.data('id'),
      type: 'PUT',})
    .done(function(data) { clearTimeout(xhrLoaderTimeout); self.removedProject(data, $project); })
    .fail(function(jqXHR, textStatus, errorThrown) {
      if (errorThrown == "FORBIDDEN"){
        clearTimeout(xhrLoaderTimeout);
        $project.removeClass('loading');
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['project-removed-denied'] });
      }else{
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] });
      }
    });

  },


  removedProject: function(data, project) {
    project.remove();
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['project-removed'] });
  },

});

Scratch.Gallery.CuratorList = Backbone.View.extend({
  events: {
    'click .remove': 'removeCurator',
    'click [data-control="promote"]': 'promoteCurator',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
  },

  removeCurator: function(e) {
    var self = this;
    var $curator = $(e.target).parents('.avatar.thumb');
    // show ajax loader if request takes longer than 300ms
    xhrLoaderTimeout = setTimeout(function() {$curator.addClass('loading');}, 300);
    $.ajax({
      url: '/site-api/users/curators-in/' + this.gallery_id + '/remove/?usernames=' + $curator.data('id'),
      type: 'PUT',})
    .fail(function(jqXHR, textStatus, errorThrown) {
      if (errorThrown == "FORBIDDEN"){
        clearTimeout(xhrLoaderTimeout);
        $curator.removeClass('loading');
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['permission-denied'] });
      }else{
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] });
      }
    })
    .done(function(data) { clearTimeout(xhrLoaderTimeout); self.removedCurator(data, $curator); });

  },

  removedCurator: function(data, curator) {
    curator.parent('li').remove();
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['curator-removed'] });
  },

  promoteCurator: function(e){
    $dialog = $("<p>Are you sure you want to promote this curator to manager? " +
            "Managers can add and delete curators and other managers, change the icon, " +
            "and edit the studio description.</p>");
    var self = this;
    $dialog.dialog({
      resizable: false,
      modal: true,
      draggable: false,
      dialogClass: "jqui-modal",
      title: "Promote curator?",
      closeText: "x",
      buttons: {
        OK: function(){
          var $curator = $(e.target).parents('.avatar.thumb');
          // show ajax loader if request takes longer than 300ms
          xhrLoaderTimeout = setTimeout(function() {$curator.addClass('loading');}, 300);
          $.ajax({
            url: '/site-api/users/curators-in/' + self.gallery_id + '/promote/?usernames=' + $curator.data('id'),
            type: 'PUT',})
          .fail(function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == "FORBIDDEN"){
              clearTimeout(xhrLoaderTimeout);
              $curator.removeClass('loading');
              Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['permission-denied'] });
            }else{
              Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] });
            }
          })
          .done(function(data) { clearTimeout(xhrLoaderTimeout); self.promotedCurator(data, $curator); });
          $(this).dialog("close");
        }
      }
    });
  },

  promotedCurator: function(data, curator) {
    curator.parent('li').remove();
    app.ownerList.$el.append(data);
  },
});

Scratch.Gallery.AddProjectBy = Backbone.View.extend({
  events: {
   'click [data-control="open-explore"], [data-control="close-explore"]' : 'toggleForm',
   'click #add-project-by-url' : 'addProjectByUrl',
   'click #add-project-by-tag' : 'addProjectByTag',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
  },

  toggleForm: function() {
    this.$('#add-project-dialog').toggle();
  },

  toggleExploreBarControl: function() {
    var openBtn = this.$('[data-control="open-explore"]');
    var closeBtn = this.$('[data-control="close-explore"]');
    if (openBtn) {
      openBtn.attr('data-control', 'close-explore');
    } else if (closeBtn) {
      closeBtn.attr('data-control', 'open-explore');
    }
  },

  appendNewProjects: function(data) {
    // $('#owner-content').prepend(data);
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['project-added'] });
  },

  addProjectByUrl: function() {
    var url = this.$('#project-url').val().trim();
    if(url.substr(-1) == '/') { url = url.substr(0, url.length - 1); }
    var url_chunks = url.split('/');
    var project_id = url_chunks[url_chunks.length -1];
    if (!isNaN(project_id) && project_id != "") {
      var self = this;
      $.ajax({
        url: '/site-api/projects/in/' + this.gallery_id + '/add/?pks=' + project_id,
        type: 'PUT',
      })
      .done(function(data) {
        if (data.trim().length != 0) {
          self.appendNewProjects(data);
        } else {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['projects-not-found'] });
        }
        self.$('input').val('');
      })
      .error(function(xhr, success, status) {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['projects-not-found'] });
      });
    } else {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['project-invalid'] });
    }
  },

  addProjectByTag: function() {
    var tag = this.$('#project-tag').val().trim();
    if (tag == "") {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['tag-empty'] });
      return;
    }
    var self = this;
    $.ajax({
      url: '/site-api/projects/in/' + this.gallery_id + '/by-tag/add/?tag=' + tag,
      type: 'PUT',
    })
    .done(function(data) {
      if (data.trim().length != 0) {
        if ($(data).hasClass('error')) {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: $(data).text()});
        } else {
          self.appendNewProjects(data);
        }
      } else {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['projects-not-found'] });
      }
      self.$('input').val('');
    });
  },

});

Scratch.Gallery.AddCuratorBy = Backbone.View.extend({
  events: {
    'click [data-control="open-explore"], [data-control="close-explore"]' : 'toggleForm',
    'click #add-curator' : 'addCurator',
    'click #add-owner': 'addOwner',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
  },

  toggleForm: function() {
    this.$('#add-curator-dialog').toggle();
  },

  addCurator: function() {
    var curator_name = this.$('#curator_ids').val().replace(/\s+/g, '');
    var self = this;
    $.ajax({
      url: '/site-api/users/curators-in/' + this.gallery_id + '/invite_curator/?usernames=' + curator_name,
      type: 'PUT',
    })
    .always(function(data) {})
    .done(function(data) {
      if (data.status === "error") {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: data.message });
      } else {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['curator-invited'] });
      }
      self.$('#curator_ids').val('');})
    .fail(function(data) {
     Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['permission-denied'] });
   });
  },

  addOwner: function() {
    var curator_name = this.$('#curator_ids').val().replace(/\s+/g, '');
    var self = this;
    $.ajax({
      url: '/site-api/users/curators-in/' + this.gallery_id + '/invite_owner/?usernames=' + curator_name,
      type: 'PUT',
    })
    .always(function(data) {})
    .done(function(data) {
      if (data.trim().length != 0) {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['curator-invited'] });
      } else {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['curator-exists'] });
      }
      self.$('#curator_ids').val('');})
    .fail(function() {
     Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['permission-denied'] });
   });
  },

});

Scratch.Gallery.AddProjectsFromList = Backbone.View.extend({
  events: {
    'click .add' : 'addProject',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
    this.$add_to_el = options.add_to_el;
  },

  addProject: function(e) {
    var project_id = $(e.currentTarget).data('add-project');
    var self = this;
    // show ajax loader if request takes longer than 300ms
    xhrLoaderTimeout = setTimeout(function() {$(e.currentTarget).addClass('loading')}, 300);
    $.ajax({
      url: '/site-api/projects/in/' + this.gallery_id + '/add/?pks=' + project_id,
      type: 'PUT',
    })
    .always(function(data) {clearTimeout(xhrLoaderTimeout); $(e.currentTarget).removeClass('loading')})
    .done(function(data) {
      if (data.trim().length != 0) {
        self.$add_to_el.prepend(data);
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['project-added'] });
      } else {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['project-exists'] });
      }

    });
  },
});


Scratch.Gallery.AddCuratorsFromList = Backbone.View.extend({
  curator_type: 'curator',

  events: {
    'click .add' : 'inviteCurator',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
    this.$add_to_el = options.add_to_el;
  },

  inviteCurator: function(e) {
    var curator_name = $(e.currentTarget).data('add-curator');
    var self = this;
    // show ajax loader if request takes longer than 300ms
    xhrLoaderTimeout = setTimeout(function() {$(e.currentTarget).addClass('loading')}, 300);
    $.ajax({
      url: '/site-api/users/curators-in/' + this.gallery_id + '/invite_' + this.curator_type + '/?usernames=' + curator_name,
      type: 'PUT',
    })
    .always(function(data) {clearTimeout(xhrLoaderTimeout); $(e.currentTarget).removeClass('loading')})
    .done(function(data) {
      if (data.status === "error") {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: data.message });
      } else {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['curator-invited'] });
      }
    })
    .fail(function(data) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['permission-denied'] });
    });
  },
});

Scratch.Gallery.AddOwnersFromList = Scratch.Gallery.AddCuratorsFromList.extend({
  curator_type: 'owner',
});

Scratch.Gallery.AcceptCuratorInvite = Backbone.View.extend({
  curator_type: 'curator',

  events: {
    'click [data-invite="accept"]': 'acceptInvite',
  },

  initialize: function(options) {
    this.gallery_id = options.gallery_id;
  },

  acceptInvite: function(e) {
    var curator_name = $(e.currentTarget).data('add-' + this.curator_type);
    var self = this;
    $.ajax({
      url: '/site-api/users/curators-in/' + this.gallery_id + '/add/?usernames=' + curator_name,
      type: 'PUT',
    }).done(function(data) {
      location.reload();
    });
    e.preventDefault();
  }
});

Scratch.Gallery.AcceptOwnerInvite = Scratch.Gallery.AcceptCuratorInvite.extend({
  curator_type: 'owner',
});

Scratch.Gallery.AddToGalleryBar = Backbone.View.extend({
  events: {
    'click [data-control="open"]' : 'openBar',
    'click [data-control="close"]' : 'closeBar',
    'click #explore-buttons span': 'switchTab',
  },

  initialize: function(options) {
    _.bindAll(this, 'loadMore');
    _.bindAll(this, 'openBar');
    this.firstOpen = true;
    var self = this;
    $('body').on('click', '[data-control="open-explore"]', function(e) {self.openBar(), $(e.currentTarget).attr('data-control', 'close-explore')}); // allow the bar to be opened remotely
    $('body').on('click', '[data-control="close-explore"]', function(e) {self.closeBar(), $(e.currentTarget).attr('data-control', 'open-explore')}); // allow the bar to be opened remotely
    this.$('.slider-carousel').on('carousel-end', function(e) {self.loadMore($(e.target))}); // load more when carousel-end trigger recieved from carousel plugin
  },

  loadMore: function($el) {
    var nextPageUrl =  $el.find('.next-page').data('url') || null;
    if (nextPageUrl != null) {
      var isFirstPage = nextPageUrl.indexOf('/1/') != -1;
      $.ajax({
        url: nextPageUrl,
      })
      .always(function(data) {$el.find('.next-page').remove()})
      .done(function(data) {
        $el.find('.scroll-content').append(data);
        if(isFirstPage) {$el.sliderCarousel();}
        $el.sliderCarousel('updateAll');
      });
    }
  },

  openBar: function() {
    //this.$('[data-content="view"]').html(this.currentView.el);
    var self = this;
    if (this.firstOpen) {
      this.$('.slider-carousel').each(function() {self.loadMore($(this))});
      this.firstOpen = false;
    }
    $('body').addClass('explore-bar-visible');
    var height = this.$('.scroll-content').css('height');
    this.$('#related-projects').animate({height: height});
    this.$('#explore-header').attr('data-control', 'close');
    this.$('#explore-header-open').removeClass('hidden');
    this.$('#explore-header-closed').addClass('hidden');
    this.$('.carousel-control').css('display', 'inline');
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

  switchTab: function(e) {
    // e can either be an event object or a string for tab name
    var tab = typeof e == 'object' ? $(e.target).data('filter') : e;
    $('#related-projects .slider-carousel-container').hide();
    $('#related-projects .slider-carousel-container.' + tab).show();
    e.stopPropagation();

  },
});

Scratch.Gallery.FollowButton = Scratch.FollowButton.extend({
  initialize: function(options) {
    _.bindAll(this, 'followed');
    _.bindAll(this, 'unfollowed');
    this.displayName = options.displayName;
    this.gallery_id = options.gallery_id;
  },

  follow: function() {
    $.ajax({
      url: '/site-api/users/bookmarkers/' + this.gallery_id + '/add/?usernames=' + Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
      type: 'put',
      success: this.onFollowSuccess.bind(this),
      error: this.onFollowError.bind(this)
    })
  },

  unfollow: function() {
    var self = this;
    $.ajax({
      url: '/site-api/users/bookmarkers/' + this.gallery_id + '/remove/?usernames=' + Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
      type: 'put'
    }).done(function(data) {self.unfollowed(); self.$('[data-count="followers"]').html(+self.$('[data-count="followers"]').text() - 1);})
  },

  onFollowSuccess: function(response, model) {
    this.$('[data-count="followers"]').html(parseInt(this.$('[data-count="followers"]').text()) + 1);
    this.followed();
  }

});

Scratch.Gallery.EditableField = Scratch.EditableTextField.extend({
  initialize: function(attributes, options) {
    this.gallery_id = attributes.gallery_id;
    Scratch.EditableTextField.prototype.initialize.apply(this, [options]);
    var self = this;
    if (attributes.el == '#title') {
      self.$('input').limit('52');
    } else if (attributes.el == '#description') {
      self.$('textarea')
      .on('keyup change', function() {
        if (self.$('textarea').val() != null && self.$('textarea').val().length >= 5000) {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['editable-text-too-long']});
        }
      })
      .limit('5000');
    }
  },

  serverCall: function(changes) {
    var self = this;
    $.ajax({
      url: '/site-api/galleries/all/' + this.gallery_id  + '/',
      type: 'put',
      data: JSON.stringify(changes),
    }).done(function(data, textStatus, jqXHR){self.success(self.model, data)})
    .fail(function(model,xhr,options) {
      self.$el.removeClass('loading');
      if (Scratch.INIT_DATA.IS_IP_BANNED) {
          $('#ip-mute-ban').modal();
      }
    })
  },
});

Scratch.Gallery.LoadButton = Backbone.View.extend({
  events: {
    'click': "loadMore",
  },

  loadMore: function(){
    Scratch.Gallery.nextPage("#owner-content", this.$el);
  }
});

Scratch.Gallery.markAsOpen = function(e, gallery_id) {
  $(e.target).attr('disabled', true);
  $('#open-gallery .label').addClass('loading');
  if ($(e.target).is(':checked')) {
    $.ajax({
      url: '/site-api/galleries/' + gallery_id + '/mark/open/',
      type: 'put'
    })
    .done(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['gallery-open'] })})
    .error(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] })})
    .always(function() {$(e.target).attr('disabled', false); $('#open-gallery .label').removeClass('loading')});
  } else {
    $.ajax({
      url: '/site-api/galleries/' + gallery_id + '/mark/closed/',
      type: 'put'
    })
    .done(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['gallery-closed'] })})
    .error(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] })})
    .always(function() {$(e.target).attr('disabled', false); $('#open-gallery .label').removeClass('loading')});
  }
};

Scratch.Gallery.disableNotifications = function(e, gallery_id) {
  $(e.target).attr('disabled', true);
  $('#disable-notifications .label').addClass('loading');
  if ($(e.target).is(':checked')) {
    $.ajax({
      url: '/site-api/galleries/' + gallery_id + '/curator-notifications/enable/',
      type: 'put'
    })
    .done(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['gallery-notifications-on'] })})
    .error(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] })})
    .always(function() {$(e.target).attr('disabled', false); $('#disable-notifications .label').removeClass('loading')});
  } else {
    $.ajax({
      url: '/site-api/galleries/' + gallery_id + '/curator-notifications/disable/',
      type: 'put'
    })
    .done(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg:  Scratch.ALERT_MSGS['gallery-notifications-off'] })})
    .error(function() {Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg:  Scratch.ALERT_MSGS['error'] })})
    .always(function() {$(e.target).attr('disabled', false); $('#disable-notifications .label').removeClass('loading')});
  }
};

Scratch.Gallery.pageScroll = function() {
  if($(window).scrollTop() == $(document).height() - $(window).height()) {
Â    Scratch.Gallery.nextPage();
  }
};

Scratch.Gallery.DEFAULT_NEXT_PAGE_SELECTOR = "#page-scroll-content";

Scratch.Gallery.nextPage = function() {
  if(arguments.length){
    var content_selector = arguments[0];
    // If no more to load after loading, remove this.
    var $actor_element = arguments[1];
  }else{
    var content_selector = Scratch.Gallery.DEFAULT_NEXT_PAGE_SELECTOR;
  }
  var $content = $(content_selector);
  var $next_page = $('.next-page', $content);
  if ($next_page.length) {
    $content.addClass('loading');
    $.ajax({
      url: $next_page.data('url'),
    }).done(function(data) {
      $content.append(data);
    }).always(function() {
      $next_page.remove();
      if($actor_element && !$('.next-page', $content).length){
        $actor_element.remove();
      }
      $content.removeClass('loading');
      if (content_selector == '#curator-content') {
        if ($('#curator-content').children('li').length < 1) {
          $('h2:contains("Curators")').hide();
        }
      }
   });
 }
};
