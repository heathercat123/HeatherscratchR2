Scratch = Scratch || {};
Scratch.EducatorStuff = Scratch.EducatorStuff || {};

/* Event aggregator - manages sending/ receiving events between EducatorStuff views */
Scratch.EducatorStuff.EventMgr = _.extend({}, Backbone.Events);

Scratch.EducatorStuff.Router = Backbone.Router.extend({
  routes: {
      "":  "showClassrooms",
      "classrooms": "showClassrooms",
      "classroom/:id": "showClassroomManage",
      "classroom/:id/manage": "showClassroomManage",
      "classroom/:id/students": "showClassroomStudents",
      "classroom/:id/studios": "showClassroomStudios",
      "classroom/:id/activity": "showClassroomActivity",
      "alerts":  "showAlerts",
      "closed":  "showClosed",
  },
  initialize: function(options){
    this.controller = options.controller;
  },
  showClassrooms: function(){
    this.controller.showClassrooms();
  },
  showClassroomManage: function(id){
    this.controller.showClassroomManage(id);
  },
  showClassroomStudents: function(id){
    this.controller.showClassroomStudents(id);
  },
  showClassroomStudios: function(id){
    this.controller.showClassroomStudios(id);
  },
  showClassroomActivity: function(id){
    this.controller.showClassroomActivity(id);
  },
  showAlerts: function(){
    this.controller.showAlerts();
  },
  showClosed: function(){
    this.controller.showClosed();
  },
});

Scratch.EducatorStuff.Controller = {
  initialize: function(options) {
    // store the router
    this.router = options.router;

    this.tabsView = new Scratch.TabsView({el: $('#sidebar')});
    this.classrooms = new Scratch.ClassroomThumbnailCollection([], {collectionType: 'all', params: {}});

    // init the clasrooms header view
    this.classroomsHeaderView = new Scratch.EducatorStuff.ClassroomsHeaderView();

    // initialize the counters
    this.classroomCount = new Scratch.CounterView({el: $('#sidebar [data-content="classroom-count"]'), model: new Scratch.Counter()});
    this.closedCount = new Scratch.CounterView({el: $('#sidebar [data-content="closed-count"]'), model: new Scratch.Counter()});
    this.unreadAlertCount = new Scratch.CounterView({el: $('#sidebar [data-content="alert-count"]'), model: new Scratch.Counter()});

    // bind events that impact sidebar elements
    Scratch.EducatorStuff.EventMgr.bind('classroom-trashed', this.classroomCount.model.decrease, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-trashed', this.classroomRemoved, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-added', this.classroomCount.model.increase, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-added', this.classroomAdded, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-closed', this.classroomCount.model.decrease, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-closed', this.closedCount.model.increase, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-closed', this.classroomRemoved, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-opened', this.classroomCount.model.increase, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-opened', this.closedCount.model.decrease, this);
    Scratch.EducatorStuff.EventMgr.bind('classroom-opened', this.classroomRestored, this);
    Scratch.EducatorStuff.EventMgr.bind('alert-dismissed', this.alertDismissed, this);
    Scratch.EducatorStuff.EventMgr.bind('student-banned', this.alertAdded, this);
    Scratch.EducatorStuff.EventMgr.bind('student-unbanned', this.alertAdded, this);
    Scratch.EducatorStuff.EventMgr.bind('student-deleted', this.alertAdded, this);

    // bind alert events
    Scratch.EducatorStuff.EventMgr.bind('success-message', function(message){
      Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: message});
    });
    Scratch.EducatorStuff.EventMgr.bind('error-message', function(message){
      Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: message});
    });
  },
  initClassroomModel: function(id){
    // make sure that the correct classroomModel has been initialized
    if(this.classroomModel == undefined || this.classroomModel.id != id){
      this.classroomModel = new Scratch.ClassroomDetail({id:id});
    }
  },
  classroomRemoved: function(id) {
    // reset router URL
    this.router.navigate("");
    // show the classrooms list
    this.showClassrooms();
    // remove the classroom el from the sidebar
    $('#sidebar [data-tab="classroom_' + id + '"]').remove();
  },
  classroomRestored: function(classroomModel) {
    // get a new li for the restored classroom
    var template = _.template($('#template-sidebar-classroom-list-item').html());
    var newLi = $(template(classroomModel.toJSON()));
    this.insertNewClassroom(newLi);
  },
  classroomAdded: function(id) {
    //init a model for the new classroom
    this.initClassroomModel(id);
    // fetch the classrom data
    this.classroomModel.fetch({
      success: function(){
        // insert a new li for the added classroom
        var template = _.template($('#template-sidebar-classroom-list-item').html());
        var newLi = $(template(this.classroomModel.toJSON()));
        this.insertNewClassroom(newLi);
        this.router.navigate("classroom/" + this.classroomModel.id, true);
      }.bind(this)
    });
  },
  alertAdded: function(){
    this.unreadAlertCount.model.increase();
    this.displayUnreadAlertCount(this.unreadAlertCount.model.attributes.count, this.unreadAlertCount.$el);
  },
  alertDismissed: function(){
    this.unreadAlertCount.model.decrease();
    this.displayUnreadAlertCount(this.unreadAlertCount.model.attributes.count, this.unreadAlertCount.$el);
  },
  displayUnreadAlertCount: function(count, $countEl){
    // only show the alert icon if the unread count is greater than 0
    if(count > 0){
      $countEl.parent(".alert-count-wrapper").removeClass("hide");
    } else {
      $countEl.parent(".alert-count-wrapper").addClass("hide");
    }
  },
  insertNewClassroom: function(newLi){
    // inject the new li
    var added = false;
    var sidebarList = '#sidebar ul';
    // if there are no classrooms, inject the new li after the All Classes li
    if(!$(".classroom", sidebarList).length){

      $('#sidebar ul li').first().after(newLi).fadeIn("fast");
    }
    else{
      // inject the new li into the classroom sub-list in alpha order
      $(".classroom", sidebarList).each(function(){
        if ($(this).attr("data-classroom-title") > $(newLi).attr("data-classroom-title")) {
            $(newLi).insertBefore($(this)).fadeIn("fast");
            added = true;
            return false;
        }
      });
      if(!added) $('#sidebar ul .classroom').last().after(newLi).fadeIn("fast");
    }
  },
  showClassrooms: function() {
    var classroomsView = new Scratch.EducatorStuff.Page({
      model: this.classrooms,
      template: _.template($('#template-classroom-content').html()),
      type: 'classrooms'
    });
    // render the classrooms header
    this.classroomsHeaderView.render();
    this.switchView(classroomsView, 'classrooms');
  },
  showAlerts: function() {
    var classroomAlertModel = new Scratch.ClassroomAlertThumbnailCollection ([], {collectionType: 'alerts', parentModel: this.classroomModel, params: {}});
    // need to retrieve the classrooms for per-classroom filtering
    this.getClassroomNames(classroomAlertModel);
    var alertsView = new Scratch.EducatorStuff.Page({model: classroomAlertModel, template: _.template($('#template-alerts-content').html()), type: 'alerts'});
    // render the classrooms header
    this.classroomsHeaderView.render();
    this.switchView(alertsView, 'alerts');

    // add the alert messages
    var filterUrl = "all/unread";
    this.messagesModel = new Scratch.ClassroomAlertThumbnailCollection ([], {collectionType: 'alerts', parentModel: this.classroomModel, filter: filterUrl});
    var self = this;
    this.messagesModel.fetch({success: function(){
      if(self.messagesModel.models.length > 0){
        self.messagesView = new Scratch.EducatorStuff.ClassroomAlertThumbnailCollectionView({model: self.messagesModel, allowHideAlerts: true, className: 'classroom-alerts'});
        $('#unread-alert-messages .content').html(self.messagesView.render().el);
        $('#unread-alert-messages').slideDown("slow");
      }
    }});
  },
  showClosed: function() {
    var closedClassrooms = new Scratch.ClassroomThumbnailCollection([], {collectionType: 'closed', params: {}});
    var classroomsView = new Scratch.EducatorStuff.Page({model: closedClassrooms, template: _.template($('#template-closed-classrooms-content').html()), type: 'classrooms'});
    // render the classrooms header
    this.classroomsHeaderView.render();
    this.switchView(classroomsView, 'closed-classrooms');
  },
  showClassroomManage: function(id){
    this.initClassroomModel(id);
    // construct the tab content view
    var classroomManageView = new Scratch.EducatorStuff.ClassroomManageView({model: this.classroomModel, template: _.template($('#template-classroom-manage').html())});
    this.showClassroom(classroomManageView, 'manage');
  },
  showClassroomStudents: function(id){
    this.initClassroomModel(id);
    var classroomStudentsModel = new Scratch.ClassroomStudentsThumbnailCollection ([], {collectionType: 'students', parentModel: this.classroomModel, params: {}});
    var classroomStudentsView = new Scratch.EducatorStuff.Page({model: classroomStudentsModel, template: _.template($('#template-classroom-students').html()), type: 'student'});
    this.showClassroom(classroomStudentsView, 'students');
  },
  showClassroomStudios: function(id){
    this.initClassroomModel(id);
    var classroomGalleriesModel = new Scratch.ClassroomGalleriesThumbnailCollection ([], {collectionType: 'studios', parentModel: this.classroomModel, params: {}});
    var classroomGalleriesView = new Scratch.EducatorStuff.Page({model: classroomGalleriesModel, template: _.template($('#template-classroom-studios').html()), type: 'gallery'});
    this.showClassroom(classroomGalleriesView, 'studios');
  },
  showClassroomActivity: function(id){
    this.initClassroomModel(id);
    // need to retrieve the classroom students for per-student filtering
    this.getStudentNames(this.classroomModel);
    var classroomActivityModel = new Scratch.ClassroomActivityThumbnailCollection ([], {collectionType: 'activity', parentModel: this.classroomModel, params: {}});
    var classroomActivityView = new Scratch.EducatorStuff.Page({model: classroomActivityModel, template: _.template($('#template-classroom-activity').html()), type: 'activity'});
    this.showClassroom(classroomActivityView, 'activity');

    // add the alert messages
    var filterUrl = this.classroomModel.id + "/unread";
    this.messagesModel = new Scratch.ClassroomAlertThumbnailCollection ([], {collectionType: 'alerts', parentModel: this.classroomModel, filter: filterUrl});
    var self = this;
    this.messagesModel.fetch({success: function(){
      if(self.messagesModel.models.length > 0){
        self.messagesView = new Scratch.EducatorStuff.ClassroomAlertThumbnailCollectionView({model: self.messagesModel, allowHideAlerts: true, className: 'classroom-alerts'});
        $('#unread-alert-messages .content').html(self.messagesView.render().el);
        $('#unread-alert-messages').slideDown("slow");
      }
    }});
  },
  showClassroom: function(tabContentView, type) {
    // if currentView is a classroom and has the same id as classroomModel,
    // user is just switching horizontal tabs.
    if(this.currentViewIsSameClassroom()){
      this.switchHTab(this.currentView, tabContentView, type);

      // TODO: come up with a better way to handle hiding alert messages on non-activity tabs
      if (type != 'activity' && this.messagesView) {
        $('#unread-alert-messages').hide();
        this.messagesView.close();
        this.messagesView = null;
      }
    }
    else {
      // fetch the classrom data
      this.classroomModel.fetch({
        success: function(){
          this.switchClassroomHeader(this.classroomModel);
          var classroomView = new Scratch.EducatorStuff.ClassroomView({model: this.classroomModel, template: _.template($('#template-classroom').html()), tabContentView: tabContentView, type: 'classroom'});
          this.switchView(classroomView, 'classroom_' + this.classroomModel.id);
          this.switchHTab(this.currentView, tabContentView, type);
        }.bind(this)
      });
    }
  },
  currentViewIsSameClassroom: function(){
    return (this.currentView &&
      this.currentView.options.type == 'classroom' &&
      this.currentView.model.id == this.classroomModel.id);
  },
  selectVTab: function(selector){
    this.tabsView.selectTab(selector);
  },
  switchHTab: function(view, subView, hTab){
    var tab = 'classroom-' + hTab;
    // switch the active tab
    $('#h-tabs li').removeClass('active');
    $('#h-tabs [data-tab="' + tab + '"]').addClass('active');
    // switch the active tab content
    $('.htab-content .tab').hide();
    $('.htab-content #' + tab).show();
    // add and render the subView
    $('#' + tab).html(subView.el);
    subView.render();
  },
  switchClassroomHeader: function(classroomModel){
    if(this.currentHeaderView) {
      this.currentHeaderView.close();
    }
    var headerView = new Scratch.EducatorStuff.ClassroomHeaderView({model: classroomModel});
    headerView.render();
    this.currentHeaderView = headerView;
  },
  switchView: function(view, vTab) {
    if (this.currentView) {
      this.currentView.close();
    }
    // select the vertical tab
    this.selectVTab(vTab);
    // switch currentView and render
    this.currentView = view;
    $('#main-content').html(this.currentView.el);
    this.currentView.render();
  },
  getStudentNames: function(model){
    var url = '/site-api/classrooms/student_names/' + model.id;
    $.ajax({
      url: url,
      success: function (response) {
        model.students = response;
      },
      async:   false
    });
  },
  getClassroomNames: function(model){
    var url = '/site-api/classrooms/all/names/';
    $.ajax({
      url: url,
      success: function (response) {
        model.classrooms = response;
      },
      async:   false
    });
  },
  sortClassroomsAlpha: function(a,b){
    var a = a.innerHTML.toLowerCase();
    var b = b.innerHTML.toLowerCase();
    return a > b ? 1 : -1;
    //return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;
  }
}

$(function() {
  // construct the router with the controller
  var router = new Scratch.EducatorStuff.Router({controller: Scratch.EducatorStuff.Controller});
  // initialize the controller (pass the router for url handling)
  Scratch.EducatorStuff.Controller.initialize({router: router});

  Backbone.history.start();

  $('#registration-done').on('click', function(e) {
    _gaq.push(['_trackEvent', 'registration', 'register-complete']);
  });
});
