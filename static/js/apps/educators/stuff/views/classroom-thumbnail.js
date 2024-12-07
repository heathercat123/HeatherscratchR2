/* View to display a single classroom item in a EducatorStuff classroom list
 */

Scratch.EducatorStuff.ClassroomThumbnailView = Backbone.View.extend({
  template: _.template($('#template-classroom-list-item').html()),
  closedTemplate: _.template($('#template-classroom-closed-list-item').html()),

  // TODO: create templates for all the success / error messages in AlertView
  tagName: 'li',

  events: {
    'click [data-control="open-classroom"]': 'openClassroom',
  },

  initialize: function() {
    // this.template = this.options.template || this.template;
    // this.model.bind('change', this.render, this);

    // bind all success & error functions in order to ensure correct context
    _.bindAll(this, "openedClassroom");
  },

  render: function() {
    // use a different template, depending on visibility
    if (this.model.get('visibility') == 'closed') {
      $(this.el).html(this.closedTemplate(this.model.toJSON()));
    } else {
      $(this.el).html(this.template(this.model.toJSON()));
    }
    return this;
  },
  openClassroom: function(e) {
    e.preventDefault();
    this.model.save({visibility: 'visible'}, {
      success: this.openedClassroom,
      error: this.error
    });
  },
  openedClassroom: function() {
    $(this.el).fadeOut();
    Scratch.EducatorStuff.EventMgr.trigger('success-message', Scratch.ALERT_MSGS['classroom-opened']);
    Scratch.EducatorStuff.EventMgr.trigger('classroom-opened', this.model);
  },
  close: function() {
    $(this.el).unbind();
    $(this.el).remove();
  },

});


Scratch.EducatorStuff.EmptyClassroomListView = Backbone.View.extend({
  template: _.template($('#template-no-classroom-content').html()),

  events: {
    'click [data-control="add_class"]': 'addClassModal',
  },

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  addClassModal: function(e){
    $('#login-dialog').modal('hide');
    e.preventDefault();
    var classData = $('<div/>');
    $('#add-class-modal').html(classData);
    new Scratch.EducatorStuff.ClassroomAddModalView({el: classData})
    $('#add-class-modal').modal('show');
  },
});


Scratch.EducatorStuff.ClassroomThumbnailCollectionView = Backbone.View.extend({
  className: 'media-list',
  tagName: 'ul',

  initialize: function() {
    this.model.bind('reset', this.render, this);
    this.model.bind('add', this.render, this);
  },

  render: function() {
    $(this.el).html('');
    if (this.model.models.length > 0) {
      _.each(this.model.models, function(classroom) {
          $(this.el).append(new Scratch.EducatorStuff.ClassroomThumbnailView({ model: classroom}).render().el);
      }, this);      
    } else {
      $(this.el).append(new Scratch.EducatorStuff.EmptyClassroomListView().render().el);
    }

    return this;
  },
});
