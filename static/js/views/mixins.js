/* MIXINS
 * This file contains objects with methods and attributes that can be shared across different classes
 */
Scratch = Scratch || {}
Scratch.Mixins = {};


/*
 This is a function for implementing python-style mixins
 for Backbone views. This function mixes two views together.
 If mutliple mixins are needed, then they must be mixed in
 separately.

 This is adapted from https://gist.github.com/hxgdzyuyi/3652964
 */
Scratch.Mixins.mixViews = function (view, mixin, custom) {
  if (custom) {
    if (custom.events && mixin.events) {
      mixin = _.clone(mixin)
      _.defaults(custom.events, mixin.events)
    }
    _.extend(mixin, custom)
  }
  var source = view.prototype || view
  _.defaults(source, mixin)
  if (mixin.events) {
    if (source.events) {
      _.defaults(source.events, mixin.events)
    } else {
      source.events = mixin.events
    }
  }
  if (mixin.initialize !== undefined) {
    var oldInitialize = source.initialize
    source.initialize = function () {
      mixin.initialize.apply(this, arguments)
      oldInitialize.apply(this, arguments)
    }
  }
  source.initialize();
  source.delegateEvents();
};

Scratch.Mixins.Pagination = Scratch.Mixins.Pagination || {};

/* data loading  and sorting.
 * adds data as opposed to replacing */
Scratch.Mixins.Pagination = {
  paginationData: {
    page: 1,
    ascsort: '',
    descsort: '',
  },

  events: {
    'click [data-control="load-more"]': 'loadMore',
    'click [data-control="sort"] li':   'sortBy',
    'click [data-control="filter"] li':  'filter',
    'click [data-control="filter"] .button':  'filter',
  },


  loadMore: function(e) {
    this.paginationData.page += 1;
    this.model.fetch({
      add: true, 
      data: this.paginationData,
      error: function(model, xhr, options) {
        if (xhr.status == 404)
          $('[data-control="load-more"]').hide();
      }
    });
  },

  reload: function(successCallback) {
    callback = successCallback ? successCallback : this.onFetch;
    this.model.reset();
    this.model.fetch({add: false, data: this.paginationData, success: callback});
  },

  resetParams: function() {
    this.paginationData = {
      page: 1,
      ascsort: '',
      descsort: '',
    };
  },

  filter: function(eventObj) {
    this.model.meta('collectionType', $(eventObj.target).data('filter'));
    this.reload();
  },

  sortBy: function(eventObj) {
    this.resetParams();
    var sortObj = {
      ascsort: $(eventObj.target).data('ascsort') || '',
      descsort: $(eventObj.target).data('descsort') || '',
    };
    $.extend(this.paginationData, sortObj);
    this.reload();
  },

  getPaginationParams: function() {
    return paginationData;
  },

};

Scratch.Mixins.AddToGalelry = {
  /* takes an array of ids or a single id */
  addById: function(ids) {
    this.model.save({projects: [projectId]}, {success: this.addedProject});
  },

  addByUrl: function(url) {
    var id = [this.getIdFromUrl(url)];
    this.addById(id);
  },

  getIdFromUrl: function(url) {
    var parsedUrl = url.match(/^http:\/\/alpha\.scratch\.mit\.edu(:[0-9]*)?\/projects\/?(\d+)\/(.*)?$/);
    if (parsedUrl) {
      return parsedUrl[2];
    } else {
      this.options.eventMgr.trigger('error', 'invalid-url');
    }
  },

  added: function(model, response) {
    this.options.eventMgr.trigger('success', 'project-added');
  },

};

/*
  Mixin used to add to views in order to require a password to 
  perform an action. 

  In order to properly mix in, use the 
  mixViews() function (above), and must contain:
    1.  events - dict to specify on which event to call getPasswordPopUp
    2.  passwordCallback - a bounded callback function to call when password 
        is validated.

    Example:
      // for view1, we want to require a password before performing the function `postData()`.
      // we want this to happen on a button click.
      var view1 = new Scratch.Views.View1();
      Scratch.Mixins.mixViews(view1, Scratch.Mixins.CheckPasswordPopUpView, {
        events: {
          'click [data-control="post-data"]': 'getPasswordPopUp',
        },
        passwordCallback: view1.postData.bind(view1)
      });

 */
Scratch.Mixins.CheckPasswordPopUpView = {
  getPasswordPopUp: function(e, callback) {
    e.preventDefault();
    var modal = $('#password-form-box');
    var self = this; 
    var passwordForm = new Scratch.CheckPasswordFormView({
      el: modal,
      passwordCallback: self.passwordCallback
    });
  }
},


/* 
  View used inside of the check password dialog. Must contain:
    1. passwordCallback - bounded callback function supplied to
       CheckPasswordPopUpView.

    Example:
      // This is continued from the example above for CheckPasswordPopUpView.
      // assume that view1 is an instantiated version of Scratch.Views.View1.
      var template = $(view1.passwordTemplate());
      $(template).dialog({
        title: gettext("Please verify your account"),
        create: function(e, ui) {
          var passwordForm = new Scratch.CheckPasswordFormView({
            el: $(this),
            passwordCallback: view1.passwordCallback
          });
        }
      });

 */

Scratch.CheckPasswordFormView = Backbone.View.extend({
  events: {
    'submit form': 'submitPasswordCheck'
  },

  initialize: function(options) {
    this.passwordCallback = options.passwordCallback;
    this.$el.modal('show');
    typeof recaptchaWidget !== 'undefined' && grecaptcha.reset();
  },

  submitPasswordCheck: function(e) {
    e.preventDefault();
    
    var self = this;
    raw_form = self.$('form').serializeArray();
    data_obj = {};
    for (var i=0; i<raw_form.length; i++) {
      data_obj[raw_form[i]['name']] = raw_form[i]['value'];
    }

    $.ajax({
      type: 'POST',
      url: '/accounts/check_password/',
      data: data_obj,
    }).done(function(data) {
      if (data['success']) {
        self.passwordCallback(data_obj);
        self.$el.modal('hide');
        $('#recaptcha-container').empty();
        typeof recaptchaWidget !== 'undefined' && grecaptcha.reset();
      } else {
        self.handleInvalidForm(data);
      }
    });
    return false;
  },

  handleInvalidForm: function(data) {
    var self = this;
    var error_str = "";
    $.each(data['errors'], function(key, value) {
      error_str += ("<li>* " + value + "</li>");
    });
    self.$('.errors').html(error_str);
    console.dir(data);
    if (data['num_tries'] >= 3) {
        if (typeof recaptchaWidget === 'undefined') {
            recaptchaWidget = grecaptcha.render('recaptcha-container');
        } else {
	    grecaptcha.reset();
        }
    }
  }
});

var recaptchaWidget;
