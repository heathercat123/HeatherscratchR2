var Scratch = Scratch || {};
Scratch.Project = Scratch.Project || {};

Scratch.Project.Router = Backbone.Router.extend({
  routes: {
    '': 'editor',
  },

  initialize: function() {
    this.projectModel = new Scratch.ProjectThumbnail(Scratch.INIT_DATA.PROJECT.model);
    var self = this;
    $.when(window.SWFready)
    .done(function(){
      Scratch.FlashApp = new Scratch.FlashAppView({model: self.projectModel, el: $('#scratch'), loggedInUser: Scratch.LoggedInUser, editor: true});
    });
  },

  editor: function() {
    $.when(window.SWFready)
    .done(function(){
      Scratch.FlashApp.setEditMode(true);
    });
  },
  
  fullscreen: function() {
    $('body').removeClass('editor').addClass('editor');
  },
});

$(function() {
  app = new Scratch.Project.Router();
  // Backbone.history.start();
});

