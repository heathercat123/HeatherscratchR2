/* View to display a single project item in a MyStuff project list
 */

Scratch.MyStuff.ProjectThumbnailView = Backbone.View.extend({
  template: _.template($('#template-project-shared-list-item').html()),
  trashedTemplate: _.template($('#template-project-trashed-list-item').html()),
  unsharedTemplate: _.template($('#template-project-list-item').html()),

  // TODO: create templates for all the success / error messages in AlertView
  tagName: 'li',
   
  events: {
    'click [data-control="share"]' : 'share',
    'click [data-control="unshare"]': 'unshare',
    'click [data-control="trash"]': 'trash',
    'click [data-control="restore"]': 'restore',
    'click [data-control="add-to"]': 'addToGallery',
  },

  initialize: function() { 
    this.template = this.options.template || this.template;
    this.model.bind('change', this.render, this);
    _.bindAll(this, 'shared'); 
    _.bindAll(this, 'unshared'); 
    _.bindAll(this, 'trashed'); 
    _.bindAll(this, 'restored'); 
  },
  
  render: function() {
    if (this.model.get('visibility') == 'trshbyusr') {
      $(this.el).html(this.trashedTemplate(this.model.toJSON()));
    } else if (this.model.get('isPublished')) {
      $(this.el).html(this.template(this.model.toJSON()));
    } else {
      $(this.el).html(this.unsharedTemplate(this.model.toJSON()));
    }
    return this;
   
  },
  
  share: function() {
    if (Scratch.INIT_DATA.IS_IP_BANNED) {
        $('#ip-mute-ban').modal();
        return;
    }
    // TODO: this should be calling either a client-side or server-side share method
    this.model.save({isPublished: true}, {
      success: this.shared, 
      error: this.error });
    this.render(); 
  },
  
  shared: function(model, response) {
    _gaq.push(['_trackEvent', 'project', 'share']);
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['project-shared']});
    this.options.eventMgr.trigger('project-shared', model);
    this.collection.shared(this);
    return false;
  },

  unshare: function(e) {
    this.model.save({isPublished: false}, {success: this.unshared, error: this.error });
    e.preventDefault();
  },

  unshared: function(model, response) {
    _gaq.push(['_trackEvent', 'project', 'unshare']);
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['project-unshared']});
    this.options.eventMgr.trigger('project-unshared', model);
    this.collection.unshared(this);
  },

  trash: function(e) {
    this.model.save({visibility: 'trshbyusr'},{success: this.trashed, error: this.error });
    e.preventDefault();
  },

  trashed: function(model, response) {
    _gaq.push(['_trackEvent', 'project', 'trashed']);
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['project-trashed']});
    $(this.el).fadeOut();
    
    this.options.eventMgr.trigger('project-trashed', model);
    if (this.model.get('isPublished')) {
      this.options.eventMgr.trigger('project-trash-shared', model);
    } else {
      this.options.eventMgr.trigger('project-trash-unshared', model);
    }
  },
  
  restore: function() {
    this.model.save({visibility: 'visible'}, {success: this.restored, error: this.error });
  },

  restored: function(model, response){
    _gaq.push(['_trackEvent', 'project', 'restored']);
    this.options.eventMgr.trigger('success', 'project-restored');
    $(this.el).fadeOut();
    this.options.eventMgr.trigger('project-restored', model);
  },

  addToGallery: function() {
    this.$('[data-content="addto-gallery-list"]').append(this.options.galleries.el);  
  },

  close: function() {
    $(this.el).unbind();
    $(this.el).remove();
  },

});

Scratch.MyStuff.ProjectThumbnailCollectionView = Backbone.View.extend({
  className: 'media-list',
  tagName: 'ul',

  initialize: function() {
    this.model.bind('reset', this.render, this);
    this.model.bind('remove', this.render, this);
    this.model.bind('add', this.add, this);
  },
  
  add: function(project) {
    $(this.el).append(
      new Scratch.MyStuff.ProjectThumbnailView({
        collection: this,
        model: project,
        template: this.options.template,
        eventMgr: this.options.eventMgr,
        galleries: this.options.galleries,
      }).render().el
    );
  },
  
   
  shared: function(project) {
    if (this.model.options.collectionType !== 'all') {
      $(this.el).fadeOut();
    }
  },

  unshared: function(project) {
    if (this.model.options.collectionType !== 'all') {
      project.$el.fadeOut();
    }
  },

  render: function() {
    $(this.el).html('');
    _.each(this.model.models, function(project) {
        $(this.el).append(
          new Scratch.MyStuff.ProjectThumbnailView({
            collection: this,
            model: project,
            template: this.options.template,
            eventMgr: this.options.eventMgr,
            galleries: this.options.galleries,
          }).render().el
        );
    }, this);
    return this;    
  },

  
  onClose: function() {
    this.model.unbind('reset', this.render);
    this.model.unbind('remove', this.render);
    this.model.unbind('add', this.add);
    _.each(this.model.models, function(model) {
      model.unbind();
    });
  },


}); 
