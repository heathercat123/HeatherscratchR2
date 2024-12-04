/* Manage data for a gallery thumbnail */

Scratch.GalleryThumbnail = Scratch.Model.extend({

  urlRoot: '/site-api/galleries/all/',

});


Scratch.GalleryThumbnailCollection = Scratch.Collection.extend({
  model: Scratch.GalleryThumbnail,
  urlRoot: '/site-api/galleries/',
  
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
