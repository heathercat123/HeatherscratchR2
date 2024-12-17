/* Manage description data for a classroom
 * supports: GET, UPDATE
 */
Scratch.Classroom.ClassroomDetail = Backbone.Model.extend({
  
  urlRoot: Scratch.ROOT_URL + '/classes',
  
  initialize: function() {
    _.bindAll(this, 'copyAttributes');
    this.bind('change', this.copyAttributes);
  },

  /* called before save or set, if invalid return an error else nothing */
  validate: function(attributes) {
      
  },

  /* get or set data from server */
  sync: function(method, model, options) {
    // override backbone's REST based urls
    options.url = Scratch.ROOT_URL + '/classes/ajax/edit/classroom/';
    Backbone.sync(method, model, options);
  },
  
  /* make a copy of attributes before changing them.
   * used for undo and errors */
  copyAttributes: function() {
    this.oldAttributes = _.clone(this.previousAttributes());
  },
});
