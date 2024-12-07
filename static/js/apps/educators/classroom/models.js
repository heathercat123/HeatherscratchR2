Scratch.Classroom.ClassroomModel = Scratch.UserThumbnail.extend({
  urlRoot: '/site-api/classrooms/all/',
  slug: 'id',

  initialize: function(attributes, options) {
    this.featuredProject = options.featured_project;
    Scratch.UserThumbnail.prototype.initialize.apply(this, [attributes, options]);
  },
  
  setFeaturedProject: function(featuredId) {
    options = {};
    options.data = {'featured_project': featuredId};
    var self = this;
    options.success = function(resp, status, xhr) {
        self.featuredProject = resp.featured_project;
        self.trigger('feature-project-updated', self, resp);
    };
    options.data = JSON.stringify(options.data);
    Backbone.sync('update', this, options);
  },

});
