var Scratch = Scratch || {};

Scratch.FlashAppView = Backbone.View.extend({
  initialize: function(options) {
    this.loggedInUser = Scratch.LoggedInUser;
    this.isEditMode = Scratch.INIT_DATA.PROJECT.is_new;

    this.ASobj = swfobject.getObjectById(this.$el.attr('id'));  // get the SWF object
    this.setContextMenuHandler();
    this.loadProjectInSwf(this.options.is_new);
    this.setLoggedInUser();

    if (this.options.editor) {  // if supporting editor and player
      _.bindAll(this, 'beforeUnload', 'setLoggedInUser');
      try {
        new Scratch.Views.TipBar({ model: new Scratch.Models.TipBar() });
      } catch(e){
        console.log('Tip bar failed to load.  Check code for errors')
      }
      this.model.bind('change:title', this.setTitle, this);
      this.loggedInUser.bind('change', this.setLoggedInUser, this);
      $(window).on('beforeunload', this.beforeUnload);

      // hook up download button on project play page
      $('#new-scratch-project .button').on('click', this.ASobj.ASdownload);
    }
  },

  setLoggedInUser: function() {
    // Let flash know the new logged in user
    console.log("in setLoggedInUser this.loggedInUser.get('username')",this.loggedInUser.get('username') );
    this.ASobj.ASsetLoginUser(this.loggedInUser.get('username'), this.lastEditorOp);
    // reload the page when we go int player mode
    // AL - commenting out.  Can't figure out why this exists.
    // Together with the "player()" function in /js/apps/project/main.js,
    // It's reloading the page on every other "see outside" click.
    // if (this.ASobj.ASisEditMode()) {
    //   this.reload = true;
    // }
  },

  // sets handlers to execute the custom swf context menus correctly across browsers
  setContextMenuHandler:function () {
    function isRightClickInEditor(e){
      return e.pageY > 24 && (e.which > 1 || e.ctrlKey);
    };

    var self=this;
    if(self.el.addEventListener){
      // AL - use addEventListener since jquery only binds to bubble, not capture.
      // stopPropagation() on the capture phase prevents the event from
      // propagating down to the SWF and firing the right click menu.
      self.el.parentNode.addEventListener("mousedown", function (e) {
        var event = $.Event("mousedown",e);  // normalize event with jquery for position and button checking
        if(isRightClickInEditor(event)){
          e.stopPropagation();  // prevent the event from propagating to the swf;
          e.preventDefault(); // Chrome wants preventDefault too
          self.customContextMenu(event);
        }
      }, true); // usecapture===true
    } else { // IE8 doesn't have a capture phase, but it does have a setCapture workaround
      self.$el.parent().on('mousedown',function(e){
        if(isRightClickInEditor(e)){
          this.setCapture(); // set focus to container elem to prevent swf from receiving right click
        }
      }).on('mouseup',function(e){
        if(isRightClickInEditor(e)){
          self.customContextMenu(e);
          this.releaseCapture(); // return focus to swf
        }
      }).on('contextmenu',function(e){ // should trigger when setCapture has focused the parent element
        e.preventDefault(); // prevent the default context menu on the container html element
      });
    }
  },

  customContextMenu:function (e) {
    if (!this.ASobj.ASisEditMode()) return; // do nothing if not in editor
    var offset = $(this.ASobj).offset(),
      scale = (e.screenX - (window.screenX||window.screenLeft||-5)) / e.pageX, // accounts for window positioned away from left side of screen
      appX = scale * (e.pageX - offset.left),
      appY = scale * (e.pageY - offset.top),
      isMac = navigator.userAgent.indexOf('Macintosh') > -1,
      notChrome = navigator.userAgent.indexOf('Chrome') == -1;
    // console.log('e.screenX:'+e.screenX+' e.pageX:'+e.pageX + ' $(window).width():'+$(window).width()+' offset.left:'+offset.left+' appX:'+appX+' appY:'+appY);
    this.ASobj.ASrightMouseDown(appX, appY, isMac && notChrome);
  },

  setEditMode: function(isEditMode) {
    this.isEditMode = isEditMode;
    this.ASobj.ASsetEditMode(isEditMode);
    if (isEditMode) { // switch to editor
      if (this.loggedInUser.authenticated) {
        // Log action
        $.get( "/log/project-see-inside/" + this.model.id + "/");
      }
      $('body').removeClass('editor').addClass('editor black');
      // skip animation for safari 5 - for some reason .animate on opacity breaks click/mouse on swf
      var is_safari = navigator.userAgent.indexOf('Safari') > -1;
      var is_chrome = navigator.userAgent.indexOf('Chrome') > -1; // chrome lists safari in userAgent!
      var is_version_5 = navigator.userAgent.indexOf('Version/5') > -1; 
      if (is_chrome && is_safari) is_safari = false;
      if (!(is_safari && is_version_5)) {
        $('body #pagewrapper').animate({opacity: 1}, 1000, function() { 
          $('body').removeClass('black white'); 
          $('body #pagewrapper').css('opacity', '1');
        });
      } else {
        $('body #pagewrapper').css('opacity', 1);
        $('body').removeClass('white black');
      }

      try {
        tip_bar_api.show();
      } catch(e){
        console.log('Tip bar failed to load.  Check code for errors')
      }
      
    } else {  // switch to player
      $('body').removeClass('editor white').addClass('viewer');
      if (this.ASobj.ASwasEdited()) {
        this.model.save({datetime_modified: Date.now()});
      }
      try {
        tip_bar_api.hide();
      } catch(e){
        console.log('Tip bar failed to load.  Check code for errors')
      }
    }
  },
  
  beEmbedded: function() {
    console.log('beEmbedded called');
    this.ASobj.ASsetEditMode(true);
  },

  setTitle: function() {
    this.model.save({visibility: 'visible'}); // move out of trash
    this.ASobj.ASsetTitle(this.model.get('title')); // then set the title in the flash
  },

  loadProjectInSwf: function(is_new) {
    // default is_new value is false
    is_new == typeof is_new !== 'undefined' ? is_new : false

    if (is_new) {
      // if a new project call AScreateProject
      // TODO: replace this with AScreateProject when the swf is ready
      console.log('new project calling AScreateProject')
      this.ASobj.AScreateProject(this.model.get('creator'), this.model.id, this.model.get('title')) 
    } else {
      console.log('existing project calling ASloadProject')
      console.log(this.ASobj, this.ASobj.ASloadProject)
      this.ASobj.ASloadProject(this.model.get('creator'), this.model.id, this.model.get('title'), !(this.model.get('isPublished')), false);
    }
  },

  beforeUnload: function() {
    if (!this.isEditMode) return;
    if (!this.loggedInUser.authenticated) { // not logged in
        if (this.ASobj.ASisUnchanged()) return;
        return 'Your changes are NOT SAVED!\nTo save, stay on this page, then log in.';
    } else { // logged in
        if (this.model.get('creator') != this.loggedInUser.get('username')) { // editing another user's project
            if (this.ASobj.ASisUnchanged()) return;
            return 'Your changes are NOT SAVED!\nTo save, stay on this page, then click “Remix”.';
        }
        // editing my own project
        if (this.ASobj.ASwasEdited()) {
            // if project was edited, record the last modification time
            this.model.save({datetime_modified: Date()}, {async: false});
        }
        var isUntitled = this.model.get('title').indexOf('Untitled') == 0;
        if (isUntitled && !this.model.get('isPublished') && this.ASobj.ASisEditMode() && this.ASobj.ASisEmpty()) {
            // this is an untitled, unpublished, empty project -- move to trash (but move out of trash if renamed)
            this.model.save({visibility: 'trshbyusr'}, {async: false});
            return;
        }
        if (this.ASobj.ASisUnchanged()) return;
        return 'Your changes are NOT SAVED!\nTo save, stay on this page, then click “Save now.”';
    }
  },
   
  syncSaveProject: function() {  
    if (!this.ASobj.ASshouldSave()) return;
    var projData = this.ASobj.ASgetProject();
    if ((projData == null) || (projData.length == 0)) return;
    $.ajax({
        url: '/internalapi/project/' + this.model.get('id') + '/set/',
        type: 'POST',
        async: false, // must be synchronous to ensure that save completes before page unloads
        data: projData
    });
  },

  takeSnapshotForReport: function() {
    this.ASobj.ASrecordThumbnail();
  },

  sendReport: function(url, data, callback) {
    window.projRepCallback = callback;
    this.ASobj.ASflagProject(url, JSON.stringify(data), "window.projRepCallback");
  }
});

function JSsetEditMode(isEditorMode) {
  Scratch.FlashApp.isEditMode = isEditorMode;
  if (isEditorMode) {
    app.navigate('editor', {trigger: true, replace: true});
  } else {
    app.navigate('player', {trigger: true, replace: true});
  }
  return true;
}

function JSsetPresentationMode(isPresentationMode) {
  if (isPresentationMode) {
    app.navigate('fullscreen', {trigger: true});
  } else {
    history.go(-1);
  }
  return true;
}

function JSeditTitle(str) {
    Scratch.FlashApp.model.save({title: str, visibility: 'visible'}); // move out of trash
}

function JSlogin(lastEditorOperation, username) {
  Scratch.FlashApp.lastEditorOp = lastEditorOperation;
  $('#login-dialog').modal('show');
  $('#login-dialog button').show();
  if(username) {
      $('#login-dialog input[name=username]').val(username);
      $('#login-dialog input[name=password]').val('');
      $('#login-dialog input[name=password]').focus();
  }
}

function JScreateProject(redirect, title) {
  // if redirect is true go to new project, if false just return id to flash for processing
  console.log('JScreateProject(redirect:', redirect, 'title:', title, ')');
  var newProject = new Scratch.ProjectThumbnail({title:title});
  if (redirect) {
    // clicked 'create' in editor
    newProject.create({
      success: function(model, response) { JSredirectTo(model.id, true)}
    });
  } else {  
    // logged in, now creating project
    newProject.create({
      success: function(model, response) {
        Scratch.FlashApp.ASobj.ASsetNewProject(model.id, title);
      }
    });
  }
}

function JSdownloadProject() {
    Scratch.FlashApp.ASobj.ASdownload();
}

function JSremixProject() {
  console.log('JSremixProject');
  var remix_action = function(){
    Scratch.FlashApp.model.remix({success: function(model, response) { Scratch.FlashApp.ASobj.ASsetNewProject(model.id, model.title);}});
  }
  if(Scratch.INIT_DATA.HAS_NEVER_REMIXED){
    $("#remix-modal").modal("show")
    .find(".button").click(function(){
      remix_action();
      $("#remix-modal").modal("hide");
    });
  }else{
    remix_action();    
  }
  _gaq.push(['_trackEvent', 'project', 'remix']);
}

function JScopyProject() {
  console.log('JScopyProject');
  Scratch.FlashApp.model.copy({success: function(model, response) { Scratch.FlashApp.ASobj.ASsetNewProject(model.id, model.title);}});
}

function JSshareProject() {
  if (Scratch.INIT_DATA.IS_IP_BANNED) {
    $('#ip-mute-ban').modal();
    return;
  }
  Scratch.FlashApp.model.share();
}


function JSredirectTo(loc, inEditor) {
  console.log('JSredirectTo', loc, inEditor);
  setTimeout(function(){
      if (!isNaN(loc)) {
        window.location.href =  '/projects/' + loc + (inEditor ? '/#editor' : '');
      } else {
        if (loc == 'home') {
          window.location.href ='/';
        } else if (loc == 'profile') {
          window.location.href = '/users/' + Scratch.LoggedInUser.get('username');
        } else if (loc == 'mystuff') {
          window.location.href = '/mystuff/';
        } else if (loc == 'about') {
            window.location.href = '/about/';
        } else if (loc == 'settings') {
          window.location.href = '/accounts/password_change/';
        } else if (loc == 'logout') {
          window.location.href =  '/accounts/logout/';
        }
      }
  }, 100);
}

// Support for URL and File Drag-n-Drop
// Note: File drag-n-drop only works on some browsers (e.g. FF12 and Chrome 19 but not FF8 or Safari 5.0.5)
function JSsetFlashDragDrop(enable) {
    Scratch.FlashApp.ASobj.ondragover = function(evt) { evt.preventDefault(); evt.stopPropagation() }
    Scratch.FlashApp.ASobj.ondrop = enable ? handleDrop : null;
}

function handleDrop(evt) {
    var x = evt.clientX;
    var y = evt.clientY;
    var textData = evt.dataTransfer.getData('Text');
    var urlData = evt.dataTransfer.getData('URL');

    if (textData) Scratch.FlashApp.ASobj.ASdropURL(textData, x, y);
    else if (urlData) FA.obj.ASdropURL(urlData, x, y);

    var fileCount = evt.dataTransfer.files.length;
    for (var i = 0; i < fileCount; i++) {
        loadFile(evt.dataTransfer.files[i], x, y);
    }
    if (evt.stopPropagation) evt.stopPropagation();
    else evt.cancelBubble = true;
}

function loadFile(file, x, y) {
    function loadError(evt) {
        console.log('Error loading dropped file: ' + evt.target.error.code);
    }
    function loadEnd(evt) {
        var data = evt.target.result;
        if (data.length > 0) Scratch.FlashApp.ASobj.ASdropFile(fileName, data, x, y);
    }
    if (window.FileReader == null) {
        console.log('FileReader API not supported by this browser');
        return;
    }
    var fileName = ('name' in file) ? file.name : file.fileName;
    var reader = new FileReader();
    reader.onerror = loadError;
    reader.onloadend = loadEnd;
    reader.readAsDataURL(file);
}

function JSsetProjectStats(scripts, sprites, usesCloudData, oldScratchProjectUrl) {
  $('#script-count').html(scripts);
  $('#sprite-count').html(sprites);

  if (usesCloudData) {
      $('#cloud-log').show();
  }
  else {
      $('#cloud-log').hide();
  }
  
  if (oldScratchProjectUrl) {
    console.log('url found');
    console.log($('#old-scratch-project').removeClass('hide'));
    $('#old-scratch-project').removeClass('hide');
    $('#old-scratch-project .button').attr('href', oldScratchProjectUrl);
    $('#old-scratch-project').show();

    $('#new-scratch-project').hide();
  }

}


}