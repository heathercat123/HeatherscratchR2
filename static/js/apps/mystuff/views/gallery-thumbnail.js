/* View to display a single gallery item in a MyStuff gallery list
 */

Scratch.MyStuff.GalleryThumbnailView = Backbone.View.extend({
  template: _.template($('#template-gallery-list-item').html()),
  tagName: 'li',
   
  events: {
    'click [data-control="trash"]' : 'trash',
  },
  
  initialize: function() { 
    _.bindAll(this, 'trashed'); 
  },
  
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  
  trash: function(e) {
    if (confirm(Scratch.ALERT_MSGS['studio-confirm-delete'])){
      this.model.save({visibility: 'delbyusr'}, {
        success: this.trashed, 
        error: this.error
      });
    }
    e.preventDefault();
  },
  
  trashed: function() {
    $(this.el).fadeOut();
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['studio-deleted']});
  },

  close: function() {
    $(this.el).unbind();
    $(this.el).remove();
  },

});



Scratch.MyStuff.GalleryThumbnailCollectionView = Backbone.View.extend({
  className: 'media-list',
  events: {
    'click #create-gallery' : 'create',
  },

  initialize: function() {
    var self = this;
    this.model.bind('reset', this.render, this)
    this.model.bind('add', function(gallery) {
      self.$el.append(new Scratch.MyStuff.GalleryThumbnailView({ model: gallery }).render().el);
    });

  },
  
  create: function() {
    this.model.create();
  },

  render: function() {
    $(this.el).html('');
    _.each(this.model.models, function(gallery) {
        $(this.el).append(new Scratch.MyStuff.GalleryThumbnailView({ model: gallery}).render().el);
    }, this);

    return this;
  },


}); 
