Scratch.UserProfile.ProfileModel = Scratch.UserThumbnail.extend({ 
  initialize: function(attributes, options) {
    this.featuredProject = options.featured_project;
    this.featuredProjectLabel = options.featured_project_label;
    Scratch.UserThumbnail.prototype.initialize.apply(this, [attributes, options]); 
  },
  
  setFeaturedProject: function(featuredId, featuredLabelId, featuredLabelName) {
    var self = this;
    options = {
      data: JSON.stringify({
        'featured_project': featuredId,
        'featured_project_label': featuredLabelId,
      }),

      success: function(resp, status, xhr) {
        self.featuredProject = resp.featured_project_data;
        self.featuredProjectLabel = resp.featured_project_label_name;
        self.trigger('feature-project-updated', self, resp);
      }
    };
    
    Backbone.sync('update', this, options); 
  },

});


