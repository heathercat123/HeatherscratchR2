/* Manage data for a classroom thumbnail (shared or unshared)  */

Scratch.ClassroomThumbnail = Scratch.Model.extend({
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
  urlRoot: '/site-api/classrooms/all/'

});


/**************************************************
* COLLECTIONS
* Manage a collection of classroom thumbnails
* intialize with @collectionType and @params{}
*/
Scratch.ClassroomThumbnailCollection = Scratch.Collection.extend({
  model: Scratch.ClassroomThumbnail,
  urlRoot: '/site-api/classrooms/',

  initialize: function(models, options) {
    // _meta contains 'filter, sort, collectionType, urlParams
    this._meta = options;
    this.options = options;
  },
  meta: function(prop, value) {
    if (value === undefined) {
      return this._meta[prop]
    } else {
      this._meta[prop] = value;
    }
  },

});


