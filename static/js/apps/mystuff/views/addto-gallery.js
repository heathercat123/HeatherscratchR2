// TODO: Working but figure out why the add to is sending the 
// POST to the wrong url /projects/<id>/

Scratch.MyStuff.AddToGalleryItemView = Backbone.View.extend({
  template: _.template($('#template-addto-gallery-item').html()),
 
  tagName: 'li',
  events: {
   'click' : 'addProject', 
  },
  
  initialize: function() {
    _.bindAll(this, 'addedProject');
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  addProject: function() {
    var self = this;
    projectId = $(this.el).closest('[data-content="addto-gallery-list"]').data('project-id');
    $.ajax({
      url: '/site-api/projects/in/' + this.model.id + '/add/?pks=' + projectId, 
      type: 'PUT',
    })
    .done(function(data) {
      self.addedProject(data);
    });
    //this.model.save({projects: [projectId]}, {success: this.addedProject}); 
  },

  addedProject: function(model, response) {
    this.options.eventMgr.trigger('success', 'project-added');    
  },

});


Scratch.MyStuff.AddToGalleryListView = Backbone.View.extend({
  tagName: 'ul',

  initialize: function() {
    var self = this
    this.model.bind('reset', this.render, this)
    this.model.bind('remove', this.render, this)
    this.model.fetch(); 
  },

  render: function() {
    $(this.el).html('');
    _.each(this.model.models, function(gallery) {
        $(this.el).append(new Scratch.MyStuff.AddToGalleryItemView({ model: gallery, template: this.options.template, eventMgr: this.options.eventMgr }).render().el);
    }, this);
  },


});
