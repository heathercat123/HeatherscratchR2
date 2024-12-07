var Scratch = Scratch || {};
Scratch.Classroom = Scratch.Classroom || {};

Scratch.Classroom.Router = Backbone.Router.extend({

  routes: {
      "": "classroom",
      //"comments*comment_id": "classroom"
  },

  initialize: function() {
    this.classroomModel = new Scratch.Classroom.ClassroomModel(Scratch.INIT_DATA.CLASSROOM.model, {
      related: {
        shared: new Scratch.ProjectThumbnailCollection([], {model: Scratch.ProjectThubnail, collectionType: 'shared'}),
        students: new Scratch.UserThumbnailCollection([], {model: Scratch.UserThumbnail, collectionType: 'students'}),
        //comments: new Scratch.CommentCollection([], {model: Scratch.Comment, collectionType: 'classroom'}),
      },
      featured_project: Scratch.INIT_DATA.CLASSROOM.featured_project,
    });
    this.classroomView = new Scratch.Classroom.EditView({model: this.classroomModel, el: $('#profile-data')});

    if (Scratch.profileHasFeatured) {
        this.featured_project = new Scratch.ProjectThumbnail(Scratch.INIT_DATA.CLASSROOM.featuredProject);
        var self = this;
        $.when(window.SWFready)
        .done(function(){
            Scratch.FlashApp = new Scratch.FlashAppView({model: self.featured_project, el: $('#scratch'), loggedInUser: Scratch.LoggedInUser});
            Scratch.FlashApp.ASobj.ASsetEmbedMode(true);
        });
    }
    if (Scratch.INIT_DATA.ADMIN) {
      this.adminView = new Scratch.AdminPanel({model: this.projectModel, el: $('#admin-panel')});
    }
  },

  classroom: function(comment_id) {
    this.classroomView.render();
    //this.commentView = new Scratch.Comments({el: $('#comments'), scrollTo: comment_id, type: 'classroom', typeId: Scratch.INIT_DATA.CLASSROOM.model.id});
  },


});

$(function() {
  Scratch.LoggedInUser = new Scratch.LoggedInUserModel(Scratch.INIT_DATA.LOGGED_IN_USER.model, Scratch.INIT_DATA.LOGGED_IN_USER.options);
  app = new Scratch.Classroom.Router();
  Backbone.history.start();
});

