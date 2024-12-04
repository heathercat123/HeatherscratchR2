var Scratch = Scratch || {};
Scratch.MyStuff = Scratch.MyStuff || {};

/* Event aggregator - manages sending/ receiving events between views */
Scratch.EventMgr = _.extend({}, Backbone.Events);


Scratch.MyStuff.Router = Backbone.Router.extend({

  routes: {
      ""            :  "projects",
      "projects"    :  "projects",
      "shared"      :  "shared",
      "unshared"    :  "unshared",
      "galleries"   :  "galleries",
      "trash"       :  "trash",
  },

  initialize: function() {
    // intialize tabs in here
    var mutedMessage = function (expiresAt) {
      var relativeTime = formatRelativeTime(expiresAt, getCookie('scratchlanguage'));
      return interpolate(Scratch.ALERT_MSGS['muted-create-studio'], {"duration": relativeTime}, true);
    }

    $('#new_studio').on('submit', function(e) {
      var $button = $('#new_studio button[type="submit"]');
      e.preventDefault();
      if (!Scratch.INIT_DATA.IS_SOCIAL) {
        openResendDialogue(); // defined in account-nav.js
      } else {
        $button.prop('disabled', true).addClass('disabled');
        $.ajax({
          url: $(e.target).attr('action'),
          type: "POST",
          dataType: "json"
        }).done (function (data, status, jqXHR) {
          if ('redirect' in data) {
              document.location = data.redirect;
          } else {
              Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: 'Could not create studio. Please try again.' });
          }
        }).error (function (jqXHR, status, err) {
          const data = jqXHR.responseJSON;
          if (data && data.new_scratcher) {
            $('#new-scratcher-gallery-modal').modal('show');
          } else if (data && data.mute_status) {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: mutedMessage(data.mute_status.muteExpiresAt * 1000)});
          } else if (jqXHR.status == 429) {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['studio-rate-limit']});
          } else {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: jqXHR.responseText });
          }
        }).always(function() {
          $button.prop('disabled', false).removeClass('disabled');
        });
      }
    });
    $('#new_project').on('click', function() {
      _gaq.push(['_trackEvent', 'project', 'create']);
    });

    this.tabsView = new Scratch.TabsView({el: $('#sidebar')});
    this.initializeCounts();
    this.bindCountEvents();
    this.initializeCollections();

  },

  initializeCounts: function() {
    this.projectCount = new Scratch.CounterView({el: $('#sidebar [data-content="project-count"]'), model: new Scratch.Counter()});
    this.sharedCount = new Scratch.CounterView({el: $('#sidebar [data-content="shared-count"]'), model: new Scratch.Counter()});
    this.unsharedCount = new Scratch.CounterView({el: $('#sidebar [data-content="unshared-count"]'), model: new Scratch.Counter()});
    this.galleryCount = new Scratch.CounterView({el: $('#sidebar [data-content="gallery-count"]'), model: new Scratch.Counter()});
    this.trashCount = new Scratch.CounterView({el: $('#sidebar [data-content="trash-count"]'), model: new Scratch.Counter()});
  },

  bindCountEvents: function() {
    Scratch.EventMgr.bind('project-trashed', this.projectCount.model.decrease);
    Scratch.EventMgr.bind('project-trashed', this.trashCount.model.increase);
    Scratch.EventMgr.bind('project-trash-shared', this.sharedCount.model.decrease);
    Scratch.EventMgr.bind('project-trash-unshared', this.unsharedCount.model.decrease);
    Scratch.EventMgr.bind('project-restored', this.projectCount.model.increase);
    Scratch.EventMgr.bind('project-restored', this.trashCount.model.decrease);
    Scratch.EventMgr.bind('project-restored', this.unsharedCount.model.increase);
    Scratch.EventMgr.bind('project-shared', this.sharedCount.model.increase);
    Scratch.EventMgr.bind('project-shared', this.unsharedCount.model.decrease);
    Scratch.EventMgr.bind('project-unshared', this.unsharedCount.model.increase);
    Scratch.EventMgr.bind('project-unshared', this.sharedCount.model.decrease);
    Scratch.EventMgr.bind('empty-trash', this.trashCount.model.reset);
  },

  initializeCollections: function() {
    this.galleryCollection = new Scratch.GalleryThumbnailCollection([], {collectionType: 'all', params: {}});
    this.addToGalleryView = new Scratch.MyStuff.AddToGalleryListView({model: this.galleryCollection, eventMgr: Scratch.EventMgr});
  },

  projects: function() {
    if (!this.projectCollection)
      this.projectCollection = new Scratch.ProjectThumbnailCollection([], {collectionType: 'all', params: {}});

    this.tabsView.selectTab('projects');
    var projectView = new Scratch.MyStuff.Page({model: this.projectCollection, template: _.template($('#template-project-content').html()), eventMgr: Scratch.EventMgr, type: 'project', galleries: this.addToGalleryView});
    this.switchView(projectView);
  },

  shared: function() {
    if (!this.sharedCollection)
      this.sharedCollection = new Scratch.ProjectThumbnailCollection([], {collectionType: 'shared', params: {}});
    
    this.tabsView.selectTab('shared');
    var sharedProjectView = new Scratch.MyStuff.Page({model: this.sharedCollection, template: _.template($('#template-project-content').html()), eventMgr: Scratch.EventMgr, type: 'project', galleries: this.addToGalleryView});
    this.switchView(sharedProjectView);
  },

  unshared: function() {
    if (!this.unsharedCollection)
      this.unsharedCollection = new Scratch.ProjectThumbnailCollection([], {collectionType: 'notshared', params: {}});
    
    this.tabsView.selectTab('unshared');
    var unsharedProjectView = new Scratch.MyStuff.Page({model: this.unsharedCollection, template: _.template($('#template-project-content').html()), eventMgr: Scratch.EventMgr, type: 'project', galleries: this.addToGalleryView});
    this.switchView(unsharedProjectView);
  },

  galleries: function() {
    this.tabsView.selectTab('galleries');
    var galleriesListView = new Scratch.MyStuff.Page({model: this.galleryCollection, template: _.template($('#template-gallery-content').html()), eventMgr: Scratch.EventMgr, type: 'gallery'});
    this.switchView(galleriesListView);
  },

  trash: function() {
    if (!this.trashedCollection)
      this.trashedCollection = new Scratch.ProjectThumbnailCollection([], {collectionType: 'trashed', params: {}});

    this.tabsView.selectTab('trash');
    var trashedProjectView = new Scratch.MyStuff.Page({model: this.trashedCollection, template: _.template($('#template-trashed-content').html()), eventMgr: Scratch.EventMgr, type: 'project'});
    Scratch.Mixins.mixViews(trashedProjectView, Scratch.Mixins.CheckPasswordPopUpView, {
      events: {
        'click [data-control="empty-trash"]': 'getPasswordPopUp',
      },
      passwordCallback: trashedProjectView.deleteAll.bind(trashedProjectView)
    });
    this.switchView(trashedProjectView);
  },

  switchView: function(view) {
    if (this.currentView) {
      this.currentView.close();
    }

    this.currentView = view;
    $('#main-content').html(this.currentView.el);
    this.currentView.render();

  }
});

Scratch.MyStuff.MyStuffView = Backbone.View.extend({
  initialize: function() {
    this.projectThumbnailCollection = new Scratch.ProjectThumbnailCollection([], {collectionType: 'all', params: {}});
    this.projectThumbnailCollectionView = new Scratch.MyStuff.ProjectThumbnailCollectionView({el: this.$('#main-content'), model: this.projectThumbnailCollection});
  },
});