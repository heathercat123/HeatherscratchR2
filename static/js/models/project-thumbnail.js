/* Manage data for a project thumbnail (shared or unshared)  */

Scratch.ProjectThumbnail = Scratch.Model.extend({
  /* data:
   * id
   * title
   * shared (bool)
   * trashed (bool)
   * stats: loves, favorites, galleries, views, remixes, comments (int)
   * dates: last-modified, created (dates)
   * thumbnail
   * selected
   */
  // TODO: Remove the 'all' portion of the URL
  urlRoot: '/site-api/projects/all/',
});


/**************************************************
* COLLECTIONS 
* Manage a collection of project thumbnails
* intialize with @collectionType and @params{}
*/
Scratch.ProjectThumbnailCollection = Scratch.Collection.extend({
  model: Scratch.ProjectThumbnail,
  urlRoot: '/site-api/projects/',
  
  initialize: function(models, options) {
    // _meta contains 'filter, sort, collectionType, urlParams
    _.bindAll(this, 'added');
    _.bindAll(this, 'deletedAll');
    this._meta = options;
    this.options = options;
  },

  added: function(response, model) {
    this.fetch();
  },
  
  deleteAll: function(options) {
    if (this._meta['collectionType'] == 'trashed') {
      options || (options = {});
      _.extend(options, {url: this.url() + 'empty/', success: this.deletedAll});
      Backbone.sync('update', this, options);  
    }
  },
  
  deletedAll: function(response, model) {
    this.fetch();
  },

  meta: function(prop, value) {
    if (value === undefined) {
      return this._meta[prop]
    } else {
      this._meta[prop] = value;
    }
  }
});


