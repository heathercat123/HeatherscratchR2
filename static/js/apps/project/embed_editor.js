var EMBED = window !== top;
try {
    var REMOTE_EMBED = EMBED && window.location.origin !== parent.location.origin;
} catch (e) {
    var REMOTE_EMBED = true;
}
var LOCAL_EMBED = EMBED && !REMOTE_EMBED;

var Scratch = Scratch || {};

Scratch.Project = Scratch.Project || {};

Scratch.openRequested = false;

Scratch.Project.FlashEmbed = function() {
};

Scratch.Project.FlashEmbed.prototype.init = function(model) {
  this.ASobj = swfobject.getObjectById('scratch');
  this.model = model;
  this.params = getUrlParams();
};

Scratch.Project.FlashEmbed.prototype.loadSwf = function() {
  if (parseInt(this.params.auto_start)) {
    this.ASobj.ASloadProject(this.model.creator, this.model.id, this.model.title, false, true);
  } else {
    this.ASobj.ASloadProject(this.model.creator, this.model.id, this.model.title, false, false);
    setTimeout(function() {
      this.ASobj.ASsetEditMode(true);
    }.bind(this), 1);
  }
};

function JSlogin(action, username){
    if(action == 'openInScratch'){
        if (!EMBED) {
            // Trying to open in Scratch while in a standalone editor while logged out
            // Just redirect to the project.
            return JSredirectTo(Scratch.FlashApp.model.id, true);
        }
        Scratch.openRequested = true;
        action = 'save';
    }
    if (LOCAL_EMBED && parent.JSlogin){
        parent.JSlogin(action, username);
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function gettext(text){
    if(LOCAL_EMBED && parent.gettext){
        return parent.gettext(text);
    }
    return text;
}

function JSredirectTo(loc, inEditor, model) {
  setTimeout(function(){
      if (!isNaN(loc) || (loc == 'editor')) {
        var hardRedirect = true;
        var pageTitle = Scratch.FlashApp.model['title'] + " " + gettext("on Scratch");
        var url = '/projects/' + loc;
        if (window.location.pathname == url && (
          inEditor && window.location.hash == "#editor" || 
          !inEditor && window.location.hash != "#editor")) {
          // Ensure the URL is exactly the same. We may be switching between the editor and the player.
          return;
        } else {
            url = url + (inEditor ? '/#editor' : '');
            if (!EMBED) {
                window.location.href = url;
            } else if (!REMOTE_EMBED){
                parent.window.location.href = url;
            } else {
                window.open(url, '_blank');
            }
        }
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

function JSeditorReady() {
  Scratch.FlashApp.loadSwf();
}

function getUrlParams() {
  var params = {};
   window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
     params[key] = value;
   });
  return params;
}

function JSeditorIsEmbedded() { return true }

function userLoggedIn () {
    if(Scratch.INIT_DATA.LOGGED_IN_USER.model){
        Scratch.FlashApp.ASobj.ASsetLoginUser(Scratch.INIT_DATA.LOGGED_IN_USER.model.username);
        if(Scratch.openRequested){
            Scratch.FlashApp.ASobj.ASexportProject();
        }
    }
}

$(function () {
    $.when(window.SWFready).then(function () {
        Scratch.FlashApp = new Scratch.Project.FlashEmbed();
        Scratch.FlashApp.init(Scratch.INIT_DATA.PROJECT.model);
        userLoggedIn();
        if(LOCAL_EMBED){
            $(parent.document).on("accountnavready", function(){
                Scratch.INIT_DATA = parent.Scratch.INIT_DATA;
                userLoggedIn();
            });
        }
    });    
})
