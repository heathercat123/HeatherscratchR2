var scratch = scratch || {}
scratch.users = scratch.users || {}
scratch.projects = scratch.projects || {}
scratch.comments = scratch.comments || {}
scratch.notifications = scratch.notifications || {}


scratch.users.URLS = {
  'edit'             : '/users/ajax/edit/user/',
  
  'add_favorite'     : '/users/ajax/<id>/add_to/favorites/',
  'add_following'    : '/users/ajax/<id>/add_to/following/',
  
  'list_followers'   : '/users/ajax/<username>/followers/',
  'list_following'   : '/users/ajax/<username>/following/',
  'list_curators'    : '/users/ajax/<galleryId>/curators/',
}

scratch.projects.URLS = {
  'edit'              : '/projects/ajax/edit/<id>/',
  'create'            : '/projects/ajax/create/',
  
  'add_love'          : '/projects/ajax/add_to/<id>/loves/',
  'action'            : '/projects/ajax/action/', 
  
  'list_projects'     : '/projects/ajax/<id>/all/',
  'list_shared'       : '/projects/ajax/<id>/public/',
  'list_favorites'    : '/projects/ajax/<id>/favorites/',
  'list_loves'        : '/projects/ajax/<id>/loves/',

  'list_notshared'    : '/projects/ajax/<id>/private/',
  'list_trashed'      : '/projects/ajax/<id>/trashed/',
  
  'list_remixes'      : '/projects/ajax/<id>/remixes/',
  'list_in_gallery'   : '/projects/ajax/in-gallery/<id>/',
  
  'list_recent'       : '/projects/ajax/recent/',
}

scratch.comments.URLS = {
  'create_project_comment'        : '/comments/ajax/project/<parentId>/create/',
  'create_user_comment'           : '/comments/ajax/user/<parentId>/create/',
  
  'delete_project_comment'        : '/comments/ajax/project/delete/',
  'flag_project_comment'          : '/comments/ajax/project/flag/',

  'list_project'                  : '/comments/ajax/project/<id>/',
  'list_user'                     : '/comments/ajax/user/<id>/',
}

scratch.notifications.URLS = {
  'list'      : '/messages/ajax/messages-list/',
  'unread'    : '/messages/ajax/get-message-count/',
  'clear'     : '/messages/ajax/messages-clear/',
  'delete'    : '/messages/ajax/messages-delete/',

  'activity'         : '/messages/ajax/user-activity/',
  'friends-activity'  : '/messages/ajax/friends-activity/',
}

// USER SERVER CALLS

scratch.users.loadUsers = function(username, filter, template, order) {
};

scratch.users.loadCurators = function($el, galleryId, template, order, callback) {
  var url = scratch.users.URLS['list_curators'].replace(/<galleryId>/, galleryId);
  $el.load(url, callback);
};


scratch.users.favorite = function(data, id, favorite, callback) {
  var loadUrl = scratch.users.URLS['add_favorite'].replace(/<id>/, id);
  var data = {
    'remove': !favorite,
    'favorites': data,
  };
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
    success: callback
  });
};

scratch.users.follow = function(data, id, follow, callback) {
  var loadUrl = scratch.users.URLS['add_following'].replace(/<id>/, id);
  var data = {
    'remove': !follow,
    'friends': data,
  };
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
    success: callback
  });
};

scratch.users.editProfile = function(data, callback) {
  var loadUrl = scratch.users.URLS['edit'];
  $.ajax({
    type: 'POST',
    url: loadUrl,
    data: JSON.stringify(data),
    success: callback
  });
};
 


// PROJECT SERVER CALLS
scratch.projects.loadProjects = function($el, data, callback) {
  var url = scratch.projects.URLS['list_' + data.filter].replace(/<id>/, data.id) + '?ordering=' + data.order + '&feature=' + data.feature + '&page=' + data.page;
  $el.load(url, callback); 
};


scratch.projects.loadRemixes = function(projectId, template, order) {
};

scratch.projects.loadGalleryProjects = function($el, galleryId, feature, order, callback) {
  var url = scratch.projects.URLS['list_in_gallery'].replace(/<galleryId>/, galleryId) + '?ordering=' + order + '&feature=' + feature;
  $el.load(url, callback);
};

scratch.projects.loadRecentProjects = function($el, order, items, feature,  callback) {
  var url = scratch.projects.URLS['list_recent'] + '?ordering=' + order + '&items=' + items + '&feature=' + feature;
  $el.load(url, callback); 
};

scratch.projects.love = function(data, love, callback) {
  var loadUrl = scratch.projects.URLS['add_love'].replace(/<id>/, data.id);
  var data = {
    'remove': !love,
  };
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
  });
};

scratch.projects.editProject = function(id, data, callback) {
  var loadUrl = scratch.projects.URLS['edit'].replace(/<id>/, id);
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
    success: callback,
  });
};

scratch.projects.createProject = function(data, callback) {
  var loadUrl = scratch.projects.URLS['create'];
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
    success: callback,
  });
};

scratch.projects.updateProjectStatus = function(projectIds, action, callback) {
  var loadUrl = scratch.projects.URLS['action'];
  var data = {
    'project_list': projectIds,
    'action': action,
  }
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
    success: callback,
  });
};

// COMMENT SERVER CALLS
scratch.comments.createComment = function(type, parentId, content, replyTo, threadId, callback) {
  var loadUrl = scratch.comments.URLS['create_' + type + '_comment'].replace(/<parentId>/, parentId);
  var data = {
    'content': content,
    'commentee': replyTo,
    'parent': threadId,
  }
  return $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl
  });
};

scratch.comments.deleteComment = function(commentId, callback) {
  var loadUrl = scratch.comments.URLS['delete_project_comment'].replace(/<commentId>/, commentId);
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: loadUrl,
    success: callback,
  });
};

scratch.comments.loadComments = function($el, type, typeId, page, callback) {
  var loadUrl = scratch.comments.URLS['list_' + type].replace(/<id>/, typeId) + '?page=' + page;
  $el.load(loadUrl, callback);
};
  
// NOTIFICATIONS

scratch.notifications.load = function(page, callback) {
  var loadUrl = scratch.notifications.URLS['list'];
  $.ajax({
    url: loadUrl,
    cache: false, // ensure that comments stay deleted after refreshing page in IE
    dataType: 'json',
    success: callback
  });
}

scratch.notifications.loadUnRead = function(callback) {
  $.ajax({
    dataType: "json",
    url: scratch.notifications.URLS['unread'],
    success: callback,
    error:function(){
      console.log('unread messages not loaded');
    }
  });
}

scratch.notifications.clearUnRead = function(callback) {
  var url = scratch.notifications.URLS['clear'];
  $.ajax({
    type: 'POST',
    url: url,
    success: callback,
  });
};

scratch.notifications.remove = function(data, callback) {
  var url = scratch.notifications.URLS['delete'];
  $.ajax({
    data: JSON.stringify(data),
    type: 'POST',
    url: url,
    success: callback,
  });
};

scratch.notifications.loadActivity = function($el, data, callback) {
  var loadUrl = ''
  if (data.friends) {
    loadUrl = scratch.notifications.URLS['friends-activity'] + '?max=' + data.max;
  } else {
    loadUrl = scratch.notifications.URLS['activity'] + '?user=' + data.actor + '&max=' + data.max;
  }
  $el.load(loadUrl, callback);
}

