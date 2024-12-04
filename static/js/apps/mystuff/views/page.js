var Scratch = Scratch || {};
Scratch.MyStuff = Scratch.MyStuff || {};

Scratch.MyStuff.Page = Backbone.View.extend(
_.extend({}, Scratch.Mixins.Pagination, {

  initialize: function() {
    this.events = _.extend({}, this.events, Scratch.Mixins.Pagination.events);
    _.bindAll(this, 'loaded');
   this.resetParams(); /* reset pagination parameters */ 
    $(this.el).html(this.options.template);
    this.list = this.$('[data-content="list"]').addClass('loading');
    this.list.append($('<div class="ajax-loader"></div>'));
    this.alertHandler = new Scratch.AlertView({el: this.$('#alert-view'), eventMgr: Scratch.EventMgr});
    if (this.options.type == 'project') {
      this.list = new Scratch.MyStuff.ProjectThumbnailCollectionView({model: this.model, eventMgr: this.options.eventMgr, galleries: this.options.galleries});
    } else if (this.options.type == 'gallery') {
      this.list = new Scratch.MyStuff.GalleryThumbnailCollectionView({model: this.model, eventMgr: this.options.eventMgr});
    } else if (this.options.type == 'classroom') {
      this.list = new Scratch.MyStuff.ClassroomThumbnailCollectionView({model: this.model, eventMgr: this.options.eventMgr});
    }
  },
  
  render: function() {
    this.model.fetch({success: this.loaded}); 
  },
  
  deleteAll: function(options) {
    this.model.deleteAll({beforeSend: function(jqXHR, settings) {
      var data = {models: JSON.parse(settings.data)};
      _.extend(data, options);
      settings.data = JSON.stringify(data);
    }});
    this.options.eventMgr.trigger('empty-trash');
  },

  loaded: function() {
    this.$('[data-content="list"]').append(this.list.el);
    this.$('[data-content="list"]').removeClass('loading');
    this.$('[data-content="list"] .ajax-loader').remove();
  },

  onClose: function() {
    this.list.close();
  },

}));
