var Scratch = Scratch || {};
Scratch.UserProfile = Scratch.UserProfile || {};

Scratch.UserProfile.Router = Backbone.Router.extend({

  routes: {
      ""            :  "profile",
      "comments*comment_id": "profile"
  },
  
  initialize: function() {
    this.profileModel = new Scratch.UserProfile.ProfileModel(Scratch.INIT_DATA.PROFILE.model, {
      related: {
        shared: new Scratch.ProjectThumbnailCollection([], {model: Scratch.ProjectThubnail, collectionType: 'shared'}),
        followers: new Scratch.UserThumbnailCollection([], {model: Scratch.UserThumbnail, collectionType: 'followers'}), 
        comments: new Scratch.CommentCollection([], {model: Scratch.Comment, collectionType: 'user'}),
      },
      featured_project: Scratch.INIT_DATA.PROFILE.featured_project,
      featured_project_label: Scratch.INIT_DATA.PROFILE.featuredProjectLabel,
    });
    this.profileView = new Scratch.UserProfile.EditView({model: this.profileModel, el: $('#profile-data')});
    
    if (Scratch.profileHasFeatured) {
        this.featured_project = new Scratch.ProjectThumbnail(Scratch.INIT_DATA.PROFILE.featuredProject);
        this.featured_project_label = Scratch.INIT_DATA.PROFILE.featuredProjectLabel;
    }
    if (Scratch.INIT_DATA.ADMIN) {
      this.adminView = new Scratch.AdminPanel({model: this.projectModel, el: $('#admin-panel')}); 
    }
  },

  profile: function(comment_id) {
    this.profileView.render();
    this.commentView = new Scratch.Comments({el: $('#comments'), scrollTo: comment_id, type: 'user', typeId: Scratch.INIT_DATA.PROFILE.model.id});
  },


});

$(function() {
  Scratch.LoggedInUser = new Scratch.LoggedInUserModel(Scratch.INIT_DATA.LOGGED_IN_USER.model, Scratch.INIT_DATA.LOGGED_IN_USER.options);
  app = new Scratch.UserProfile.Router();
  Backbone.history.start();
});

