var Scratch = Scratch || {};
Scratch.UserProfile = Scratch.UserProfile || {};

Scratch.UserProfile.EditThumbnail = Backbone.View.extend({

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
    });
  },

  showEdit: function(e) {
    this.$el.addClass('edit');
  },

  hideEdit: function(e) {
    this.$el.removeClass('edit');
  },

  imageUploadSuccess: function(event, xhr) {
    this.$el.removeClass('loading');
    if (xhr.result.error) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: xhr.result.error});
    } else if (xhr.result.errors) {
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS[xhr.result.errors[0]], timer: 10000 });
    }
    else {
      this.$('img').attr('src', xhr.result.thumbnail_url);
      Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['thumbnail-changed']});
    }
  },

  imageUploadStart: function() {
    this.$el.removeClass('edit');
    this.$el.addClass('loading');
  },

  submit: function(e) {
  },

});

Scratch.UserProfile.EditFeatured = Backbone.View.extend({
  events: {
    'mouseover': 'showEdit',
    'mouseout': 'hideEdit',
    'click [data-control="edit"]': 'openProjectsModal',
  },

  initialize: function() {
   //$('#featured-project-modal').modal({show: false });
   this.model.bind('feature-project-updated', this.updateFeaturedProject, this);
   this.projectSelection = new Scratch.UserProfile.FeaturedProjectsModal({model: this.model.related.shared});
  },

  showEdit: function(e) {
    this.$el.parents('.player').addClass('edit');
  },

  hideEdit: function(e) {
    this.$el.parents('.player').removeClass('edit');
  },

  openProjectsModal: function(e) {
    e.preventDefault();
    this.projectSelection.$el.modal('show');
    this.model.related.shared.fetch();
  },

  updateFeaturedProject: function(model, resp) {
    $('h3.featured-project-heading').text(model.featuredProjectLabel);
  
    var featuredProject = model.featuredProject;
    if (featuredProject) {
      featuredProject.isPublished = true;
      // change image
      $('#featured-project img').attr('src', featuredProject.thumbnail_url);
      // change link
      var link = '/projects/'+ featuredProject.id;
      $('#featured-project').attr('href', link);
      $('.player .title .project-name').attr('href', link);
      // change title
      $('.player .title .project-name').text(featuredProject.title);
    }
  },

  loadProject: function(projectData) {
    projectData.isPublished = true;
    $.when(window.SWFready)
    .done(function(){
      Scratch.FlashApp.model = new Scratch.ProjectThumbnail(projectData);
      Scratch.FlashApp.loadProjectInSwf();
    });
  },



});


Scratch.UserProfile.EditableTextField = Scratch.EditableTextField.extend({
  error: function(model,xhr,options) {
    this.$el.removeClass('loading');
    if (Scratch.INIT_DATA.IS_IP_BANNED) {
        $('#ip-mute-ban').modal();
    }
  },
});


// About me and What I'm Doing
Scratch.UserProfile.EditAboutMe = Scratch.UserProfile.EditableTextField.extend({
  initialize: function(attributes, options) {
    Scratch.EditableTextField.prototype.initialize.apply(this, [options]);
    var self = this;

    self.$('textarea')
    .on('focusin',function(){
      self.$('#bio-chars-left').text(200-self.$('textarea').val().length);
      self.$('#bio-chars-left').parent().show();
    })
    .on('focusout',function(){
      self.$('#bio-chars-left').parent().hide();
    })
    .limit('200','#bio-chars-left');
  },

  onEditSuccess: function(data) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['bio-changed'] });
  },
});

Scratch.UserProfile.EditStatus = Scratch.UserProfile.EditableTextField.extend({
  initialize: function(attributes, options) {
    Scratch.EditableTextField.prototype.initialize.apply(this, [options]);
    var self = this;
    self.$('textarea')
    .on('focusin',function(){
      self.$('#status-chars-left').text(200-self.$('textarea').val().length);
      self.$('#status-chars-left').parent().show();
    })
    .on('focusout',function(){
      self.$('#status-chars-left').parent().hide();
    })
    .limit('200','#status-chars-left');
  },

  onEditSuccess: function(data) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['status-changed'] });
  },

});

Scratch.UserProfile.FeaturedProjectsModal = Scratch.CollectionView.extend({
  listTemplate: _.template($('#template-project-collection').html()),
  wrapperTemplate: _.template($('#template-modal-container').html()),

  className: 'modal hide fade in',

  id: 'featured-project-modal',

  events: function() {
    return _.extend({}, Scratch.CollectionView.prototype.events, {
      'click .project img' : 'select',
      'click [data-control="save"]' : 'setNewFeatured',
    });
  },

  initialize: function(attributes, options) {
    _.bindAll(this, 'setNewFeatured');
    Scratch.CollectionView.prototype.initialize.apply(this, [attributes, options]);
  },

  select: function(e) {
    this.$('.project.thumb').removeClass('selected');
    $(e.target).parent().addClass('selected');
  },

  setNewFeatured: function(e) {
    var $featuredProject = this.$('.project.thumb.selected')
    var $featuredProjectLabel = this.$('select[name="feature-label"]')
    // parent model of the group of shared projects is the user profile, update that model
    this.model.parentModel.setFeaturedProject(
      $featuredProject.data('id'),
      $featuredProjectLabel.val(), // Selected label ID
      $($featuredProjectLabel.prop("selectedOptions")).text() // Selected label name
    );
    this.$el.modal('hide');
  },

});


Scratch.UserProfile.EditView = Backbone.View.extend({
  initialize: function() {
    this.thumbnail = new Scratch.UserProfile.EditThumbnail({el: $('#profile-avatar'), model: this.model});
    this.featured = new Scratch.UserProfile.EditFeatured({el: $('#featured-project'), model: this.model});
    this.report = new Scratch.UserProfile.Report({el: $('#profile-box-footer'), model: this.model});
    
    if($('#bio').length){ // if #bio is present, we're in editable mode, otherwise not.
      this.aboutMe = new Scratch.UserProfile.EditAboutMe({el: $('#bio'), model: this.model});
      this.myStatus = new Scratch.UserProfile.EditStatus({el: $('#status'), model: this.model});
    } else{
      $('#bio-readonly,#status-readonly').verticalTinyScrollbar();
    }
  },

  events: {
    'click #report-this': 'openReport',
  },

  render: function() {
    this.thumbnail.render();
  },

  openReport: function() {
    this.report.makeReport();
  },

  onFollowSuccess: function(response, model) {
    _gaq.push(['_trackEvent', 'profile', 'follow_add' ]);
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['followed'] + this.model.get('username')});
  },

  onUnfollowSuccess: function(response, model) {
    _gaq.push(['_trackEvent', 'profile', 'follow_remove' ]);
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['unfollowed'] + this.model.get('username')});
  },

});
Scratch.UserProfile.EditView.mixin(Scratch.Mixins.Followable);


Scratch.UserProfile.Report = Backbone.View.extend({
  template: _.template($('#template-report').html()),
  thankyou: _.template($('#template-thanks').html()),
  $selectables: $('.box .header-text, #status, #status-readonly .overview, #bio, #bio-readonly .overview, .box .avatar'),

  clearSelectedField: function(){
    // Allow the stylesheet to take prescedence
    this.$selectables.css({
      'background-color': '',
      'border': '',
      'border-radius': ''
    });
  },

  makeReport: function(){
    var self = this;
    $(document).on('click', '#report_form #radio_username', function() {
      self.clearSelectedField();
      $('.box .header-text').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });
    $(document).on('click', '#report_form #radio_icon', function() {
      self.clearSelectedField();
      $('.box .avatar').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });
    $(document).on('click', '#report_form #radio_description', function() {
      self.clearSelectedField();
      $('#bio, #bio-readonly .overview').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });
    $(document).on('click', '#report_form #radio_working_on', function() {
      self.clearSelectedField();
      $('#status, #status-readonly .overview').animate({ backgroundColor: "pink"}).css('border','1px solid red').css('border-radius','5px');
    });

    var thankyou = $(this.thankyou());
    $(this.template()).dialog({
      title: "Report profile?",
      close: function(){ self.clearSelectedField(); },
      open: function(){
        dialog = this;
        $(".ui-widget-overlay").click(function(){$(dialog).dialog("close");})
      },
      buttons: {
        "Send": function (e) {
          var postData = {
            selected_field: $('#report_form input:checked').val()
          };
          if(! postData['selected_field']){
            $('.profile-report form').animate({backgroundColor: "pink"});
            $('.profile-report .errors').show();
            return false;
          }
          $(e.target).closest('button').button('disable');
          var dialog = this;
          $.post(self.model.url() + 'report/', postData, function(){
            _gaq.push(['_trackEvent', 'profile', 'report_add']);
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
        },

        Cancel: function(){
          $(this).dialog("close");
        }
      }
    });
  }

});

Scratch.UserProfile.ScratcherPromotionModal = Backbone.View.extend({
    initialize: function() {
        this.$el.find('.step').hide().eq(0).show();
        this.updateButtons();
        this.updateProgress();
    },
    events: {
        'click #promotion-next': 'next',
        'click #promotion-prev': 'prev',
        'click #promotion-agree': 'agree'
    },
    next: function(evt) {
        var $currentStep = this.$el.find('.step:visible')
        var $nextStep = $currentStep.next('.step').show();
        $currentStep.hide();
        this.updateButtons();
        this.updateProgress();
    },
    prev: function(evt) {
        var $currentStep = this.$el.find('.step:visible')
        var $prevStep = $currentStep.prev('.step').show();
        $currentStep.hide();
        this.updateButtons();
        this.updateProgress();
    },
    getStep: function() {
        // starting at 0, find the step number of the currently shown step
        var $steps = this.$el.find('.step');
        for (var i = 0; i < $steps.length; ++i) {
            $el = $steps.eq(i);
            if ($el.is(':visible')) {
                return i;
            }
        }
    },
    updateProgress: function() {
        var $progressLi = this.$el.find('.progress li');
        $progressLi.removeClass('current')
        $progressLi.eq(this.getStep()).addClass('current');
    },
    updateButtons: function() {
        var step = this.getStep();
        var $currentStep = this.$el.find('.step:visible')
        var $next = this.$el.find('#promotion-next');
        var $prev = this.$el.find('#promotion-prev');
        var $agree = this.$el.find('#promotion-agree');
        var $ok = this.$el.find('#promotion-ok');
        $agree.hide();
        if (step === 0) {
            $prev.hide();
        } else if ($currentStep.is('.agree')) {
            $next.hide();
            $agree.show();
        } else if ($currentStep.is('.end')) {
            $ok.show();
            this.$el.find(".progress").hide();
            $prev.hide();
            $agree.hide();
        } else {
            $next.show(); $prev.show()
        }
    },
    agree: function() {
        $.get('/users/'+ Scratch.INIT_DATA.PROFILE.model.username +'/promote-to-scratcher/').success(_.bind(function() {
            $('#scratcher-promotion').remove(); // remove link to become scratcher
            $('#profile-data .profile-details .group').html('Scratcher');

            // show the last step
            this.next();
        }, this)).error(function() {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: "Hm... there was an error."});
        })
    }
});
Scratch.UserProfile.ScratcherPromotion = Backbone.View.extend({
    initialize: function() {
        if (window.location.hash === '#promote') {
            this.showModal({preventDefault: function(){}});
        }
    },
    events: {
        'click #scratcher-promotion': 'showModal'
    },
    showModal: function(evt) {
        evt.preventDefault();
        $.get('/users/'+ Scratch.INIT_DATA.PROFILE.model.username +'/scratcher-promotion/').success(function(html) {
            if ($('#scratcher-promotion-modal').html() === '') {
                // if we already got the popup, don't rebind
                $('#scratcher-promotion-modal').html(html).modal();
                $('#scratcher-promotion-modal').on('shown', function() {
                    var modalView = new Scratch.UserProfile.ScratcherPromotionModal({el: '#scratcher-promotion-modal'});
                    $('#scratcher-promotion-modal').off('shown');
                })
            } else {
                $('#scratcher-promotion-modal').modal();
            }
        }).error(function(){
            window.location.hash = '';
        });
    }
});
new Scratch.UserProfile.ScratcherPromotion({el: '#profile-data .box-head'});
