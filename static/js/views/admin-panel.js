var Scratch = Scratch || {};
Scratch.AdminPanel = Scratch.AdminPanel || {};

Scratch.AdminPanel = Backbone.View.extend({
  events: {
    'click [data-control="hide"]' : 'hide',
    'click [data-control="show"]' : 'show',
    'click [data-control="feature"]' : 'feature',
    'click [data-control="defeature"]' : 'defeature',
    'click [data-control="moderate_remixes"]' : 'moderate_remixes',
    'click [data-control="make_design_studio"]' : 'make_design_studio',
    'click [data-control-action="clear_avatar_image"]' : 'clear_avatar_image',
    'click [data-control-action="clear_studio_image"]' : 'clear_studio_image',
    'click [data-control-action="clear_project_image"]' : 'clear_project_image',
    'click [data-control-action="add_teacher_status"]' : 'addTeacherStatus',
    'click [data-control-action="remove_teacher_status"]' : 'removeTeacherStatus',
    'click [data-control-action="confirm-email"]' : 'confirmUserEmail'
  },

  initialize: function() {
    $('body').addClass('admin');

    // handle toggle more explicitly, in case an admin scrolled directly to a deleted comment
    // that is visible when other deleted comments are not.
    var self = this;
    $(this.el).find('[data-control-action=\'show_deleted_comments\']').click(function() {
      $('#comments .removed').toggle();
    });

    $(this.el).find('[data-control-action=\'show_mystuff\']').click(function() {
        document.location = '/scratch_admin/mystuff/' + Scratch.INIT_DATA.PROFILE.model.username + '/';
    });

    this.entity = location.pathname.split('/')[1];
    if (this.entity === 'scratch2') this.entity = 'projects';
    if (this.entity === 'scratch2-studios') this.entity = 'studios';

    _.bindAll(this, 'handleData');

    var url = this.getAdminUrl();
    if ( url ) {
      $.ajax({
          url: url,
          success: this.handleData
      });
    }
    if (localStorage.getItem("adminPanelToggled_"+this.entity)!=='closed' && $(this.el).find('DIV.admin-content').children().length > 2) {
      this.show();
    }

    $('#admin-dialog').on('show', function () {
        window.parent.postMessage('showDialog', '*');
    });

    $('#admin-dialog').on('hide', function () {
        window.parent.postMessage('hideDialog', '*');
    })

    if ($(this.el).find('#homepage-refresh-form').length > 0) {
      this.events['submit #homepage-refresh-form'] = 'submitHomepageRefresh';
      this.delegateEvents();
    }
  },

  getAdminUrl: function() {
    if (Scratch.INIT_DATA.ADMIN_PANEL && 'adminURL' in Scratch.INIT_DATA.ADMIN_PANEL){
      return Scratch.INIT_DATA.ADMIN_PANEL['adminURL'];
    }
    var admin_url_parts = location.pathname.split('/').slice(0,3);
    if (admin_url_parts.length < 3){
      return null;
    }
    admin_url_parts.push('admin', '');
    return admin_url_parts.join('/');
  },

  showIPBan: function() {
    // shows IP banning interface
    // Does  it really?
  },

  convertIP: function(str) {
      var num = parseInt(str);
      var d = num%256;
      for (var i = 3; i > 0; i--) {
          num = Math.floor(num/256);
          d = num%256 + '.' + d;
      }
      return d;
  },

  setBanFromTemplate: function () {
      $('.admin-dialog-ban-textarea').val($('.admin-dialog-ban-template').val());
      $('.admin-dialog-ban-info-length').val(
          $('.admin-dialog-ban-template').find(':selected').data('ban-length') || ""
      );
      $('input[name="appeal-allowed"]').prop(
          'checked',
          ($('.admin-dialog-ban-template').find(':selected').data('appeal') === 1)
      );
  },

  handleData: function(data) {
    var self = this;
    var el = $(this.el);
      if(this.entity == 'users' || this.entity == 'scratch_admin') {
          var ban_url = '/scratch_admin/ban/' + Scratch.INIT_DATA.PROFILE.model.username + '/';
          var notify_url = '/scratch_admin/notify/' + Scratch.INIT_DATA.PROFILE.model.username + '/';
          var note_url = '/scratch_admin/create_internal_note/' + Scratch.INIT_DATA.PROFILE.model.username + '/'
          var states = {
              'active': 'activate',
              'banned': 'ban',
              'autobanned': 'ban',
              'bannedbyeducator': 'ban',
              'delbyadmin': 'delete',
              'delbyusr': 'deleteuser',
              'delbyusrwproj': 'deleteuserwproj',
              'delbyclass': 'deleteclass',
              'delbyadminglobal': 'deleteadminglobal'
          };
          var actions = {
              'activate': 'active',
              'ban': 'banned',
              'delete': 'delbyadmin',
              'deleteuser': 'delbyusr',
              'deleteuserwproj': 'delbyusrwproj',
              'deleteadminglobal': 'delbyadminglobal'
          };
          var actionname = states[data.ban.status];
          if (actionname == 'ban') {
              if (data.ban.expires == null) {
                  el.find('#banned_until').html('forever');
              }
              else {
                  el.find('#banned_until').html('until ' + data.ban.expires);
              }
          }
          else {
              el.find('#banned_until').empty();
          }

          var who_banned_when = '';
          if (data.ban.last_modified_by) {
            who_banned_when += 'by ' + data.ban.last_modified_by;
          }
          if (data.ban.last_modified) {
            who_banned_when += ' on ' + data.ban.last_modified;
          }
          el.find('.whowhen').html(who_banned_when)

          el.find('#adm_ntf_cnts').html(data.admin_notif_counts.recent + '/' + data.admin_notif_counts.all)
    
          // exclude from homepage checkbox
          var exclude_cb = el.find('div.excluded_from_hp :checkbox');
          exclude_cb.prop('checked', data.excluded_from_hp);
          exclude_cb.change(function(e) {
              $.ajax(ban_url, {type: 'POST', data: JSON.stringify({excluded_from_hp: exclude_cb.is(':checked')}), dataType: 'json', success: function() {}});
          });

          el.find('div.status[data-control-action="'+actionname+'"]').addClass('selected');
          el.find('div.status[data-control-action]').click(function(e) {
              if($(e.target).hasClass('selected')) return;

              var action = $(e.target).attr('data-control-action');
              if (action in actions && action != 'ban') {
                var confirmed_action = true;
                var appeal_allowed = true;
                
                if (action == 'delete') {
                  appeal_allowed = false;
                }
                if (action == 'deleteadminglobal') {
                  var confirm_prompt = "Are you sure you want to globally delete this user?" +
                    " This will delete all traces of the user across the entire site";
                  confirmed_action = confirm(confirm_prompt);
                  appeal_allowed = false;
                }
                if (confirmed_action) {
                  $.post(ban_url, JSON.stringify({ban_status: actions[action], appeal_allowed: appeal_allowed}), function() {
                    self.selectState(action);
                    el.find('#banned_until').empty();
                  }, 'json');
                }
                return;
              } else if (action == 'deleteclass') {
                $.post(ban_url, JSON.stringify({ban_status: 'delbyclass'}), function() {
                    self.selectState('deleteclass');
                    el.find('#banned_until').empty();
                }, 'json');
                return;
              }

              // Open modal dialog with underscore template 'template-ban-dialog'
              // Add event handlers for banning / cancelling
              $('#admin-dialog').html(_.template($('#template-ban-dialog').html(),
                    {username: Scratch.INIT_DATA.PROFILE.model.username}
              ));

              $('#admin-dialog').modal('show');

              // initialize the fields to the default template
              self.setBanFromTemplate();

              $('.admin-dialog-ban-template').change(function(e) {
                  // set the ban text, ban length and ban appeal settings based on change
                  self.setBanFromTemplate();
              });
              $('.admin-dialog-ban-textarea').on('change', function(evt) {
                  // when they change the template text, mark it as custom
                  $('.admin-dialog-ban-template').val(null);
              });

              //get modactions
              getModActions(Scratch.INIT_DATA.PROFILE.model.userId);

              $('#admin-dialog button.btn-primary').click(function() {
                  var banLength = $('.admin-dialog-ban-info-length').val() || null;
                  var message = $('.admin-dialog-ban-textarea').val();
                  var args = {
                      ban_status: actions[action],
                      ban_length: banLength,
                      appeal_allowed: $('input[name="appeal-allowed"]:checked').length > 0,
                      ban_message: message,
                      type: $('.admin-dialog-template-dropdown option:selected').text()
                  };
                  $.ajax(ban_url, {
                      type: 'POST',
                      data: JSON.stringify(args),
                      dataType: 'json',
                      success: function() {
                        self.selectState(action);
                      }
                  });
                  $('#admin-dialog').modal('hide');
              });
          });

          el.find('button[data-control-action="notify"]').click(function(e) {
              //clear out ajax-loaded data if it exists already
              if ($('#admin-dialog-comments-list').length) {
                  $('#admin-dialog-comments-list').empty();
              }
              if ($('#admin-dialog-notifications').length) {
                  $('#admin-dialog-notifications').empty();
              }

              var comments = null;
              var url = '/scratch_admin/comments/' + Scratch.INIT_DATA.PROFILE.model.username + '/';
              var nextPage = 1; // /comments/user/?page=1 is the next page after /comments/user/
              var hasMore = 1;
              $.ajax(url, {
                  type: 'GET',
                  success: function(data) {
                      comments = $(data).find("ul.comments").children("li");
                  },
                  error: function(data) {
                      comments = [];
                  }
              }).then(function() {
                  $('#admin-dialog').html(_.template($('#template-notify-dialog').html(), {
                      username: Scratch.INIT_DATA.PROFILE.model.username,
                      coms: commentsToObj(comments)
                  }));

                  $('#admin-dialog').width('auto');
                  $('#admin-dialog').modal('show');
                    $('#admin-dialog-message textarea').val($('#admin-dialog-message select').val());
                  $('#admin-dialog-message select').change(function(e){
                      $('#admin-dialog-message textarea').val($('#admin-dialog-message select').val());
                  });
                  $('#admin-dialog-message textarea').on('change', function(evt) {
                      // when they change the template text, mark it as custom
                      $('#admin-dialog-message select').val(null);
                  });

                  notificationCheckboxes();
                  getModActions(Scratch.INIT_DATA.PROFILE.model.userId);

                  //Set filters for comments view
                  $("#admin-dialog-comments select").change(function(e){
                    $("#admin-dialog-comments-list li").remove();
                    nextPage = 0;
                    hasMore = 1;
                    loadComments(); // Picks up new selected filter
                  });

                  $('#admin-dialog button.btn-primary').click(function(){
                      var args = {message: $('#admin-dialog-message textarea').val(), type: $('#admin-dialog-message option:selected').text()};
                    $.ajax(notify_url, {type: 'POST', data: JSON.stringify(args), dataType: 'json', success: function() {}});
                      $('#admin-dialog').modal('hide');
                  });

                  function loadComments() {
                    var deletedFilter = null;
                    switch ($("#admin-dialog-comments select").val()) {
                      case 'Marked by Filter':
                        deletedFilter = 2;
                        break;
                      case 'Deleted':
                        deletedFilter = 1;
                        break;
                    }
                    var filterParam = deletedFilter ? ('&deleted=' + deletedFilter) : '';
                    url = '/scratch_admin/comments/' + Scratch.INIT_DATA.PROFILE.model.username + '/?page=' + nextPage + filterParam;
                    $.ajax(url, {
                      type: 'GET',
                      success: function (data) {
                        if ($(data).find('li').length > 0) {
                          nextPage++;
                          comments = commentsToObj($(data).find('li'));
                          for (var i = 0; i < comments.length; i++) {
                              $('#admin-dialog-comments-list').append(''+
                                '<li>'+
                                '  <div class="admin-dialog-checkbox">' +
                                '    <input type="checkbox">' +
                                '  </div>' +
                                '  <div class="comment ' + comments[i].class + '">' +
                                '    <span class="info">' +
                                '      <span class="comment-date">' + comments[i].info + '</span> ' +
                                '      | ' +
                                '      <span class="comment-type">' + comments[i].type + '</span> ' +
                                '      | ' +
                                '      <span class="comment-visibility">' + comments[i].visibility + '</span>' +
                                '    </span>' +
                                '    <br/>' +
                                     comments[i].content +
                                '  </div>' +
                                '</li>');
                            }
                        } else {
                          hasMore = 0;
                        }
                      },
                      error: function () {
                        hasMore = 0;
                      }
                    });
                  }

                  //add infinite scroll
                  $("#admin-dialog-comments .comments-list").scroll(function() {
                    if (!hasMore) return;
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                      loadComments();
                    }
                  });
              });
          });

          el.find('button[data-control-action="unmute"]').click(function(e) {
               var $mutedButton = $(this);
               // muted = 0 means unmute
               $.post($mutedButton.attr('data-url'), {muted: 0, automod:true}, function(data) {
                  if (data === 'ok') {
                      el.find('#mute-score').text('refresh to recalculate');
                      el.find('#user-muted').hide();
                      $mutedButton.prop('disabled', true);
                      $mutedButton.addClass('disabled');
                  } else {
                    Scratch.AlertView.msg($('#alert-view'), {alert: 'failure', msg: 'Something went wrong'});
                  }
               });
           });
           el.find('button[data-control-action="mute"]').click(function(e) {
               var $mutedButton = $(this);
               // muted = 0 means unmute
               $.post($mutedButton.attr('data-url'), {muted: 1, automod:true}, function(data) {
                   if (data === 'ok') {
                       el.find('#mute-score').text('12');
                       el.find('#user-muted').text('User is Muted. Expires in 12 hours');
                       $mutedButton.prop('disabled', false);
                       $mutedButton.removeClass('disabled');
                   } else {
                       Scratch.AlertView.msg($('#alert-view'), {alert: 'failure', msg: 'Something went wrong'});
                   }
               });
           });
           el.find('span[data-control-action="clear-score"]').click(function(e) {
               var $clearScoreButton = $(this);
               $.post($clearScoreButton.attr('data-url'), {clear: 1, automod:true}, function(data) {
                   if (data === 'ok') {
                       el.find('#mute-score').text('0');
                   } else {
                       Scratch.AlertView.msg($('#alert-view'), {alert: 'failure', msg: 'Something went wrong'});
                   }
               });
           });
          el.find('button[data-control-action="create_internal_note"]').click(function(e) {
              $('#admin-dialog').html(_.template($('#template-note-dialog').html(),
                    {username: Scratch.INIT_DATA.PROFILE.model.username}
              ));

              $('#admin-dialog').width('auto');
              $('#admin-dialog').modal('show');

              notificationCheckboxes();
              getModActions(Scratch.INIT_DATA.PROFILE.model.userId);

              $('#admin-dialog button.btn-primary').click(function(){
                  var args = {message: $('#admin-dialog-message textarea').val(), type: $('#admin-dialog-message option:selected').text()};
                  $.ajax(note_url, {
                    type: 'POST',
                    data: JSON.stringify(args),
                    dataType: 'json',
                    success: function() {$('#admin-dialog').modal('hide');}
                  });
              });
          });

          $('#homepage_history').html(_.template($('#template-homepage-history').html(),
              {features: data.hp_history}
          ));
      }
      else if(this.entity == 'projects' || this.entity == 'studios') {
          var mod_url;
          var notify_user;
          if(this.entity=='projects'){
            mod_url = '/scratch_admin/moderate_project/' + Scratch.INIT_DATA.PROJECT.model.id + '/';
            notify_user = Scratch.INIT_DATA.PROJECT.model.creator;
          }else if(this.entity=='studios'){
            mod_url = '/scratch_admin/moderate_gallery/' + Scratch.INIT_DATA.GALLERY.model.id + '/';
            notify_user = Scratch.INIT_DATA.GALLERY.model.owner;
          }
          self.model_data = data;
          var notify_url = '/scratch_admin/notify/' + notify_user + '/';
          var mod_states = {
              safe: 'fe',
              notsafe: 'nfe',
              notreviewed: 'unreviewed',
              censored: 'censored',
              permcensored: 'permcensored',
              delbyadmin: 'deleted',
          };
          var selected = mod_states[data.mstat];
          el.find('.statuses .status.'+selected).addClass('selected');

          var whowhen = ''
          if (data.last_moderated_by) {
            whowhen += 'by ' + data.last_moderated_by;
          }
          if (data.last_moderated_timestamp) {
            whowhen += ' on ' + data.last_moderated_timestamp;
          }

          el.find('.whowhen').html(whowhen);

          el.find('.statuses .status[data-control-action]').click(function(e) {
              var but = $(e.target);
              var change_status = function(message){
                if(but.hasClass('selected')) return;

                var new_state = null;
                for(var state in mod_states) {
                    if(but.hasClass(mod_states[state])) {
                        new_state = state;
                        break;
                    }
                }

                var action = $(e.target).attr('data-control-action');
                var post_data = {
                  mod_status: new_state
                };
                if(message){
                  post_data['message'] = message;
                }
                $.ajax(mod_url, {
                    type: 'POST',
                    data: post_data,
                    success: function() {
                      el.find('div.status[data-control-action].selected').removeClass('selected');
                      but.addClass('selected');
                      self.model_data.mstat = new_state;
                    }
                });
              }

              if (but.hasClass('censored') || but.hasClass('permcensored')){
                $('#admin-dialog').html(_.template($('#template-notify-dialog').html(), {
                    username: Scratch.INIT_DATA.PROJECT.model.creator
                }));
                $('#admin-dialog').modal('show');
                $('#admin-dialog textarea').val($('#admin-dialog select').val());
                $('#admin-dialog select').change(function(e){
                    $('#admin-dialog textarea').val($('#admin-dialog select').val());
                });
                $('#admin-dialog textarea').on('change', function(evt) {
                    // when they change the template text, mark it as custom
                    $('#admin-dialog select').val(null);
                });
                $('#admin-dialog button.btn-primary').click(function(){
                  change_status($('#admin-dialog textarea').val());
                  $('#admin-dialog').modal('hide');
                });

                var creatorId = $('#admin-dialog-notifications').attr('data-creator-id');
                getModActions(creatorId);
              }else{
                change_status();
              }


          });

          el.find('.community-censored-section .status').on('click', function(evt) {
            var $target = $(evt.target);
            var uncensor = $target.data('control-action') === 'uncensor' ? 1:0;
            $.post('/scratch_admin/community-uncensor/'+ $target.data('project-id'),
            {'uncensor': uncensor}).done(function(projectVisibility) {
                document.location.reload(true);
            });
          });
          if (this.entity == 'studios') {
            el.find('.project-count').html('Projects: ' + data.project_count);
            el.find('.comment-count').html('Comments: ' + data.comment_count);
            el.find('.owners-count').html('Managers: ' + data.owners_count);
            el.find('.curators-count').html('Curators: ' + data.curators_count);
          }
      }
  },

  clear_avatar_image: function(e) {
    var url = '/users/' + Scratch.INIT_DATA.PROFILE.model.username + '/clear_avatar_image/';
    $.ajax(url, {type: 'POST', dataType: 'json', success: function(data) {
      alert('done');
    }});
  },

  clear_studio_image: function(e) {
    var url = '/studios/' + Scratch.INIT_DATA.GALLERY.model.id + '/clear_studio_image/';
    $.ajax(url, {type: 'POST', dataType: 'json', success: function(data) {
      alert('done');
    }});
  },

  clear_project_image: function(e) {
    var url = '/projects/' + Scratch.INIT_DATA.PROJECT.model.id + '/clear_project_image/';
    $.ajax(url, {type: 'POST', dataType: 'json', success: function(data) {
      alert('done');
    }});
  },

  toggleTeacherStatus: function(username, action) {
    var cb = cb || function(){};
    var url = '/scratch_admin/profile/' + username + '/toggle_teacher/';
    $.ajax(url, {
      type: 'POST',
      data: {action: action},
      dataType: 'json',
      success: function () {
        document.location.reload()
      },
      error: function (data) {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: data.responseJSON.error});
      }
    })
  },

  addTeacherStatus: function (e) {
    var view = this;
    var $dialog = $(
      '<p>Are you sure? After a teacher has created classrooms, this may not be undone.</p>');
    $dialog.dialog({
      buttons: {
        Cancel: function() { $(this).dialog('close'); },
        "I'm sure": function () {
          view.toggleTeacherStatus($(e.target).data('controlUser'), 'add');
          $(this).dialog('close');
        }
      }
    });
  },

  removeTeacherStatus: function (e) {
    var view = this;
    var $dialog = $(
      '<p>Are you sure you want to remove the user\'s teacher status?</p>');
    $dialog.dialog({
      buttons: {
        Cancel: function() { $(this).dialog('close'); },
        "I'm sure": function () {
          view.toggleTeacherStatus($(e.target).data('controlUser'), 'remove');
          $(this).dialog('close');
        }
      }
    });
  },


  selectState: function(newState) {
    $(this.el).find('div.status[data-control-action].selected').removeClass('selected');
    $(this.el).find('div.status[data-control-action="'+newState+'"]').addClass('selected');
  },

  hide: function(e) {
    window.parent.postMessage('closePanel', '*');
    localStorage.setItem("adminPanelToggled_"+this.entity, 'closed');
    $('body').addClass('closed');
    $(this.el).animate({width: [10, 'swing']}, 0);
  },

  show: function() {
    $('body').removeClass('closed');
    $(this.el).animate({width: [230, 'swing']}, 0);
    localStorage.setItem("adminPanelToggled_"+this.entity, 'open');
    window.parent.postMessage('openPanel', '*');
  },

  feature: function(e) {
    var id = "";
    if (this.entity == 'projects') {
      id = Scratch.INIT_DATA.PROJECT.model.id;
    } else {
      id = Scratch.INIT_DATA.GALLERY.model.id;
    }

    $.ajax('/scratch_admin/feature/' + this.entity + '/' + id, {
      type: 'POST',
      data: {},
      dataType: 'json',
      success: function() {
        $(e.target).html('Defeature');
        $(e.target.parentNode).data('control', 'defeature');
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: 'FEATURED'});
      },
      error: function() {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error']});
      },
    });
  },

  defeature: function(e) {
    var id = "";
    if (this.entity == 'projects') {
      id = Scratch.INIT_DATA.PROJECT.model.id;
    } else {
      id = Scratch.INIT_DATA.GALLERY.model.id;
    }

    $.ajax('/scratch_admin/defeature/' + this.entity + '/' + id, {
      type: 'POST',
      data: {},
      dataType: 'json',
      success: function(response, xhr) {
        $(e.target).html('Feature');
        $(e.target.parentNode).data('control', 'feature');
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: 'DEFEATURED'});
      },
      error: function() {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error']});
      },
    });
  },

  moderate_remixes: function(e) {
    var curStatus = this.model_data.mstat;
    var doModeration = confirm('Are you sure you want to set all remixes of this project to ' + curStatus + '?' +
                               'This action is NOT reversible.');

    var change_status = function(message) {
      var post_data = {
        mod_status: curStatus
      };
      if (message != null) {
        post_data['message'] = message;
      }

      $.ajax('/scratch_admin/moderate_project_remixes/' + Scratch.INIT_DATA.PROJECT.model.id + '/', {
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(response, xhr) {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: 'All remixes are now being set to ' + curStatus + '.'});
        },
        error: function() {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error']});
        }
      });
    }

    if (!doModeration)
      return;

    if (['censored', 'permcensored'].indexOf(curStatus) > -1) {
      $('#admin-dialog').html(_.template($('#template-notify-dialog').html(), {
          username: Scratch.INIT_DATA.PROJECT.model.creator
      }));
      $('#admin-dialog').modal('show');
      $('#admin-dialog textarea').val($('#admin-dialog select').val());
      $('#admin-dialog select').change(function(e){
          $('#admin-dialog textarea').val($('#admin-dialog select').val());
      });
      $('#admin-dialog textarea').on('change', function(evt) {
          // when they change the template text, mark it as custom
          $('#admin-dialog select').val(null);
      });
      $('#admin-dialog button.btn-primary').click(function(){
        change_status($('#admin-dialog textarea').val());
        $('#admin-dialog').modal('hide');
      });
    } else {
      change_status();
    }
  },

  make_design_studio: function(e) {
    var id = Scratch.INIT_DATA.GALLERY.model.id;

    $.ajax('/scratch_admin/make_design_studio/' + this.entity + '/' + id, {
      type: 'POST',
      data: {},
      dataType: 'json',
      success: function(response, xhr) {
        $(e.target.parentNode).remove();
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: 'This is now the Scratch Design Studio'});
      },
      error: function() {
        Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: Scratch.ALERT_MSGS['error']});
      },
    });
  },

  submitHomepageRefresh: function(e) {
    e.preventDefault();
    $.ajax($(this.el).find('#homepage-refresh-form').attr('action'), {
      type: 'POST',
      data: $(this).serialize(),
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if (data.errors) {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: data.errors[0]});
        } else if (data.success) {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: data.success});
        }
      },
      timeout: 180000 // set to 3 minutes
    });
  },

  confirmUserEmail: function(e) {
    var button = $(e.target);
    $.ajax('/scratch_admin/profile/' + $(e.target).data('controlUser') + '/confirm_email/', {
      type: 'POST',
      data: {'confirmed_email': true},
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if (data.err) {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: data.err[0]});
        } else if (data.success) {
          button.hide();
          var label = button.siblings('div.unconfirmed');
          label.removeClass('unconfirmed').addClass('confirmed');
          label.text('EMAIL CONFIRMED');

          Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: 'Email Confirmed.'});
        } else {
          Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: 'Confirmation unsuccessful.'});
        }
      }
    })
  }
});
