/* Tabs for multi-page backbone apps 
 * e.g MyStuff or Notifications 
 */

var Scratch = Scratch || {};

Scratch.TabsView = Backbone.View.extend({
 
  events: {
    'click li a': 'switchTab',
  },

  switchTab: function(e) {
    this.$('li').removeClass('active');
    $(e.target.parentNode).addClass('active');
  },

  selectTab: function(tab) {
    this.$('li').removeClass('active');
    if (tab) {
      this.$('[data-tab="' + tab + '"]').addClass('active');
    }
  },


}); 
