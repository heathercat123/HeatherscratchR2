var Scratch = Scratch || {};
Scratch.Classroom = Scratch.Classroom || {};

Scratch.Classroom.EditTitle = Scratch.EditableTextField.extend({
  initialize: function(attributes, options) {
    this.model.bind('change:title', this.render, this);
    Scratch.EditableTextField.prototype.initialize.apply(this, [options]);
    if(this.$('input').length) this.$('input').limit('52');
  },

  render: function() {
    this.$('input').val(this.model.get('title'));
  },

});


Scratch.Classroom.EditThumbnail = Backbone.View.extend({
  template: _.template($('#template-user-avatar').html()),

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
    }
    else {
      var new_src = xhr.result.thumbnail_url + '?' + new Date().getTime(); // unique hash param to force refresh
      this.$('img').attr('src', new_src);
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

Scratch.Classroom.EditFeatured = Backbone.View.extend({
  template: _.template($('#template-featured-title').html()),

  events: {
    'mouseover': 'showEdit',
    'mouseout': 'hideEdit',
    'click [data-control="edit"]': 'openProjectsModal',
  },

  initialize: function() {
   //$('#featured-project-modal').modal({show: false });
   this.model.bind('feature-project-updated', this.updateFeaturedProject, this);
   this.projectSelection = new Scratch.Classroom.FeaturedProjectsModal({model: this.model.related.shared});
  },

  showEdit: function(e) {
    this.$el.addClass('edit');
  },

  hideEdit: function(e) {
    this.$el.removeClass('edit');
  },

  openProjectsModal: function(e) {
    this.projectSelection.$el.modal('show');
    this.model.related.shared.fetch();
  },

  updateFeaturedProject: function(model, resp) {
    var featuredProject = model.featuredProject;
    this.loadProject(featuredProject);
    this.$('.title').html(this.template(this.model.featuredProject));
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



// Description
Scratch.Classroom.EditDescription = Scratch.EditableTextField.extend({
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

// Status
Scratch.Classroom.EditStatus = Scratch.EditableTextField.extend({
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
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['bio-changed'] });
  },
});

Scratch.Classroom.ModalFeaturedProjectPlayer = Scratch.CollectionView.extend({
    initialize: function(attributes, options) {
        return;
    },
    events: {
        'click #featured-project': 'showFeaturedProjectPlayerModal',
        'hide #modal-featured-project-player': 'stopProject'
    },
    showFeaturedProjectPlayerModal: function(evt) {
        evt.preventDefault();
        this.$el.find('#modal-featured-project-player').modal();
    },
    stopProject: function(evt) {
        // Scratch.FlashApp.ASstopRunning();
    }
});
new Scratch.Classroom.ModalFeaturedProjectPlayer({el: '.player'});

Scratch.Classroom.FeaturedProjectsModal = Scratch.CollectionView.extend({
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
    var $newProject = this.$('.project.thumb.selected');
      // parent model of the group of shared projects is the user profile, update that model
      this.model.parentModel.setFeaturedProject($newProject.data('id'));
      //this.model.parentModel.save({'featured_project': $newProject.data('id')}, {wait: true, success: this.success});
      this.$el.modal('hide');
  },

});


Scratch.Classroom.EditView = Backbone.View.extend({
  initialize: function() {
    this.title = new Scratch.Classroom.EditTitle({el: $('#title'), model: this.model});
    this.thumbnail = new Scratch.Classroom.EditThumbnail({el: $('#profile-avatar'), model: this.model});
    this.featured = new Scratch.Classroom.EditFeatured({el: $('.player'), model: this.model});
    this.report = new Scratch.Classroom.Report({el: $('#profile-box-footer'), model: this.model});

    if($('#bio').length){ // if #bio is present, we're in editable mode, otherwise not.
      this.aboutMe = new Scratch.Classroom.EditDescription({el: $('#bio'), model: this.model});
    } else{
      $('#bio-readonly,#status-readonly').verticalTinyScrollbar();
    }
    if($('#status').length){ // if #bio is present, we're in editable mode, otherwise not.
      this.aboutMe = new Scratch.Classroom.EditDescription({el: $('#status'), model: this.model});
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
    this.report.toggleOpen();
  },
});

Scratch.Classroom.Report = Backbone.View.extend({
  template: _.template($('#template-report').html()),

  initialize: function(options) {
    this.isOpen = false;
    this.isSent = false;
  },

  events: {
    'click [data-control="close"]' : 'close',
    'click [data-control="submit"]': 'submit',
  },

  render: function() {
    this.$el.html(this.template());
    this.$el.attr('data-type', 'report');
    if(this.isSent) {
          this.$('div.form').hide();
          this.$('div.message').show();
    }
  },

  close: function() {
    this.$el.animate({height: '0'}, function() { $(this).hide(); });
    this.isOpen = false;
  },

  open: function() {
      if(this.$el.css('height') > 0) {
          var self = this;
        this.$el.show().animate({height: '0', complete: function() { self.open(); }});
        this.isOpen = false;
      } else {
        this.render();
        this.$el.show().animate({height: '190'});
        this.isOpen = true;
      }
  },

  toggleOpen: function() {
      if(this.isOpen && this.$el.attr('data-type') == 'report' && this.$el.css('height') > 0)
          this.close();
      else
          this.open();
  },

  submit: function() {
    if(!confirm('Are you sure you want to report this class?')) return;

      var postData = {
        notes: this.$('textarea').val(),
        ban: this.$('input[type="checkbox"]').is(':checked')
      };
      if(/\w+/.test(postData.notes)) {
        var self = this;
        $.ajax({
            type: 'POST',
            url: this.model.url() + 'report/',
            data: JSON.stringify(postData),
            dataType: 'json',
        }).done(function(){
          _gaq.push(['_trackEvent', 'profile', 'report_add']);
        });
        this.$('div.form').hide();
        this.$('div.message').show();
        this.isSent = true;
      }
      else {
          // Clear field and show placeholder again
          // TODO: should we do more?
          this.$('textarea').val("");
      }
  },
});
