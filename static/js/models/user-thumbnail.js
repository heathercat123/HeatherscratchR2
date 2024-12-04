/* Manage data for a project thumbnail (shared or unshared)  */

Scratch.UserThumbnail = Scratch.Model.extend({
  /* data:
   * id
   * username 
   * thumbnail 
   */
  urlRoot: '/site-api/users/all/',
  slug: 'username', 
 /*
  parse: function(response) {
    var parsedResponse = Scratch.Model.prototype.parse.apply(this, [response]); 
    parsedResponse = $.extend(parsedResponse.fields
    return $.extend(response.fields, {'id': response.pk });
  },
  */
});


/**************************************************
* COLLECTIONS 
* Manage a collection of project thumbnails
* intialize with @collectionType and @params{}
*/
Scratch.UserThumbnailCollection = Scratch.Collection.extend({
  model: Scratch.UserThumbnail,
  urlRoot: '/site-api/users/',
  slug: 'username', 


  initialize: function(models, options) {
    // _meta contains 'filter, sort, collectionType, urlParams
    this._meta = options;
    this.options = options;
    
    
  },

  /*
  url: function() {
    var url = this.urlRoot;
    url += (this._meta['collectionType'])? this._meta['collectionType']+ '/' : '';
    
    return url
  },
  
  url_params: function(params) {
    return '?' + $.param(_.extend({}, this._meta['params'], params));
  },

  sync: function(method, model, options) {
    if (!options.url) {  
      options.url = this.url() + this.url_params({});
    }
    Backbone.sync(method, model, options);
  },
*/

  deleteItem: function(model, options) {
    this.remove(model);
    options.url = this.url() + 'remove/' + this.url_params({usernames: model.get('fields').user.username}); 
    this.sync('update', model, options);
  },
  
  addItem: function(options) {
    options.url = this.url() + 'add/' + this.url_params({usernames: options.usernames});
    this.sync('update', new Scratch.UserThumbnail(), options);
  },

  meta: function(prop, value) {
    if (value === undefined) {
      return this._meta[prop]
    } else {
      this._meta[prop] = value;
    }
  },

});


Scratch.LoggedInUserModel = Scratch.UserThumbnail.extend({
  
  authenticated: false,
  admin: false, /* TODO: this might not be a good idea */
  
  loginUrl: '/login/',
  loginRetryUrl: '/login_retry/',
  currentLoginUrl: '/login/',
  
  initialize: function(attributes, options) {
    this.constructor.__super__.initialize.apply(this, [attributes, options])
    this.authenticated = options.authenticated;
  },
  
  // data is username and password
  login: function(data, options) {
    // TODO: login an anonymous user
    this.save(data, $.extend(options, {url: this.currentLoginUrl, wait:true}));
    this.authenticated = true;
   },

  logout: function() {
    this.authenticated = false;
    // TODO: Logout a logged in user
  },

    
});
