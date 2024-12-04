Scratch.Mixins = Scratch.Mixins || {};

Scratch.Mixins.Followable = { 
  events: {
   'click [data-control="follow"]' : 'follow',
   'click [data-control="unfollow"]' : 'unfollow',
  },
  
  initialize: function() {
    _.bindAll(this, 'followed');
    _.bindAll(this, 'unfollowed');
  },

  follow: function() {
    this.model.related.followers.addItems(Scratch.LoggedInUser.get('username'), {success: this.followed, error: this.onFollowError});
  },
  
  followed: function(response, model) {
    this.$('[data-control="follow"]').removeClass('blue notfollowing').addClass('grey following').attr('data-control', 'unfollow');
    this.onFollowSuccess(response, model); 
  },
  
  // overwrite this to customize
  onFollowSuccess: function(response, model) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['followed'] });
  },

  onFollowError: function(response, model) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'error', msg: response.responseJSON[0].errors.join(',') });
  },

  unfollow: function(response, model) {
    this.model.related.followers.removeItems(Scratch.LoggedInUser.get('username'), {success: this.unfollowed});
  }, 
  
  unfollowed: function(response, model) {
    this.$('[data-control="unfollow"]').removeClass('grey following').addClass('blue notfollowing').attr('data-control', 'follow');
    this.onUnfollowSuccess(response, model);
  },

  onUnfollowSuccess: function(response, model) {
    Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['unfollowed'] });
  },

};
