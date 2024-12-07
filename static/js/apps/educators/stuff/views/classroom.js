/* View to display a single classroom tab
 */

Scratch.EducatorStuff.ClassroomView = Backbone.View.extend({
  template: _.template($('#template-classroom').html()),

  events: {

  },

  initialize: function() {
    this.template = this.options.template || this.template;
    this.tabContentView = this.options.tabContentView;
    this.model.bind('change', this.render, this);
  },

  render: function() {
    // only render when not triggered by a model change
    // otheriwise, re-rendering the header causes the tab content to be removed
    // TODO: Handle model change to the Count attributes (e.g. Student count)
    if(!this.model._changing) {
      $(this.el).html(this.template(this.model.toJSON()));
    }
    return this;
  },
  close: function() {
    $(this.el).unbind();
    $(this.el).remove();
  },

});
