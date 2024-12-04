var Scratch = Scratch || {};

Scratch.Model = Backbone.Model.extend({
  initialize: function(attributes, options) {
	_.bindAll(this, 'report');

    // handle related models
    if (options && options.related) {
      this.related = options.related;
      var self = this;
      $.each(this.related, function(name, collection) {
        collection.parentModel = self;
      });
    }
    this.init(options);
  },
  
  url: function() {
    return this.urlRoot + this.getId() + '/'; 
  },
  
  /* Return the id for this model, or if a slug is set 
   * return that value */ 
  getId: function() {
    return (this.slug)? this.get(this.slug) : this.id;
  },

  /* init function for models that extend this one */
  init: function(options){},
  
  parse: function(response) {
    if (response.fields) {
      return $.extend(response.fields, {'id': response.pk });
    } else {
      return response;
    }
  },
  
  create: function(options) {
    options=options||{};
    options.url=this.urlRoot + 'create/';
    if (this.isNew()) {
      if (!options.error) {// to help with debugging when sync fails
        options.error=function(){
          if(console.error) {console.error('in model.create, error arguments:',arguments);}
        }
      }
      Backbone.sync('create', this, options);
      return true;
    }
    return false;
  },

  fetchRelated: function(related) {
    if (related) {
      this.related[related].fetch()
    } else {
      $.each(this.related, function(name, collection) {
        collection.fetch();
      });    
    } 
  },
 

 /* 
  sync: function(method, model, options) { 
    options.url = this.urlRoot;
    // Override Backbone's default REST urls/
    if (method=='update' || method=='create') {
      options.url += this.id + '/';
    }
    Backbone.sync(method, model, options);
  },
  */

 // Used for reporting projects and profiles
 report: function(options, callback) {
   options || (options = {});
   var url = this.url() + 'report/';
   $.ajax(url, {type: 'POST', data: JSON.stringify(options), dataType: 'json', success: callback});
 },
});

Scratch.Collection = Backbone.Collection.extend({
    paginationData: {
      page: 1,
      ascsort: '',
      descsort: '',
    },
    
    hasMore: true,
    count: 0,
     
    url: function() {
      var url = this.urlRoot;
      url += (this.options['collectionType'])? this.options['collectionType']+ '/' : '';
      url += (this.parentModel)? this.parentModel.getId() + '/': '';
      return url;
    },
    
    addItems: function(items, options) {
      var options = options || {}
      var param_name = (this.slug)? this.slug + 's' : 'pks'
      var count = _.isArray(items)? items.length : 1;
      items = _.isArray(items) ? items.join(',') : items; 
      options.url = this.url() + 'add/?' + param_name + '=' + items; 
      var success = options.success;
      var self = this;

      options.success = function(resp, status, xhr) {
        self.add(resp);
        if (success) success(this, resp);
        self.trigger('addItemsSuccess', count);
      };

      Backbone.sync('update', this.parentModel, options);
    },

    removeItems: function(items, options) {
      var options = options || {};
      var param_name = (this.slug)? this.slug + 's' : 'pks'
      var count = _.isArray(items)? items.length : 1;
      items = _.isArray(items) ? items.join(',') : items; 
      options.url = this.url() + 'remove/?' + param_name + '=' + items;
      var success = options.success;
      var self = this;

      options.success = function(resp, status, xhr) {
        var model_ids = [];
        for (i=0; i < resp.length; i++) {
          model_ids[i] = resp[i].id;
        }
        self.remove(model_ids);
        if (success) success(this, resp);
        self.trigger('removeItemsSuccess', count);
      };
      
      Backbone.sync('update', this.parentModel, options);
    },

    loadMore: function(options) {
      if (!this.hasMore) {
        return false;
      }
      var options = options || {};
      this.paginationData.page += 1;
      var self = this;
      var error = options.error || {};
      options.error = function(resp, status, xhr) {
        self.hasMore = false;
        error();
      },
      options.add = true;
      options.data = this.paginationData;
      this.fetch(options);
    },
    
    // sort is an object { ascsort: '' } or { descsort: ''}
    ajaxSort: function(sort, options) {
      var options = options || {};
      this.paginationData.page = 1;
      $.extend(this.paginationData, sort);
      options.data = this.paginationData;
      options.add = false; 
      this.fetch(options);
    },
  
    ajaxFilter: function(filter, options) {
      self.hasMore = true;
      var options = options || {};
      this.paginationData.page = 1;
      this.options.collectionType = filter;
      options.data = this.paginationData;
      options.add = false;
      this.fetch(options);
  },

});






