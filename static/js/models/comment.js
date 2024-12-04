Scratch.Comment = Scratch.Model.extend({
  urlRoot: '/site-api/comments/',
}); 

Scratch.CommentCollection = Scratch.Collection.extend({
  model: Scratch.Comment,
  urlRoot: '/site-api/comments/',

  initialize: function(models, options) {
    this.options = options;
  },
  toggleDisabled: function() {

  },
  addComment: function(comment, options) {
    var options = options || {};
    options.url = this.url() + 'add/?'; 
    options.data = JSON.stringify(comment);
    return Backbone.sync('create', this.parentModel, options);
  },

  isCommentOkay:function (content) {
    /*  COMMENT THIS OUT BECAUSE IT BREAKS COMMMENTS ON PROFILES/ GALLERIES - referencing project owner 
    if (!content) return "Comment empty.";
    var username = Scratch.LoggedInUser.get('username'),
    projCreator=window.backbone_data.project.fields.creator,
    dupes=0;
    this.filter(function(m){
      if (m.attributes.content===content && projCreator !== username && m.attributes.user.username === username){
        dupes++;
      }
    });
    if (dupes>9) return "It seems like you are commenting the same thing over and over. Please don't spam.";
    return 'ok';
    */
  },

 // Used for reporting projects and profiles
 report: function(options, callback) {
   options || (options = {});
   var url = this.url() + 'rep/';
   $.ajax(url, {type: 'POST', data: JSON.stringify(options), dataType: 'json', success: callback});
 },

 // Used for reporting projects and profiles
 unreport: function(options, callback) {
   options || (options = {});
   var url = this.url() + 'unrep/';
   $.ajax(url, {type: 'POST', data: JSON.stringify(options), dataType: 'json', success: callback});
 },
});
