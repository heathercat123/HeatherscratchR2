Scratch = Scratch || {};

/* Scratch.Counter and Scratch.CounterView are used 
 * for counters that need to be updated in sync as in 
 * the mystuff section. This is done using a variable count
 * instead of fetching updated model lists */
Scratch.Counter = Backbone.Model.extend({
  defaults: {
    count: 0,
  },

  initialize: function() {
    _.bindAll(this, 'increase'); 
    _.bindAll(this, 'decrease');
    _.bindAll(this, 'reset');
  },

  increase: function() {
    this.set('count', this.get('count') + 1);
  },

  decrease: function() {
    this.set('count', this.get('count') - 1);
  },
  
  reset: function() {
    this.set('count', 0);
  },

});


Scratch.CounterView = Backbone.View.extend({
  template: _.template($('#template-counter').html()),
  
  initialize: function() {
   this.model.bind('change:count', this.render, this);
   var initCount = $(this.el).text() || 0;
   this.model.set('count', parseInt(initCount));
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

});


/* Scratch.SimpleCounterView updates a count based on 
 * a collections length */

Scratch.SimpleCounterView = Backbone.View.extend({
  template: _.template($('#template-counter').html()),

  initialize: function() {
    this.model.bind('add', this.render, this);
    this.model.bind('remove', this.render, this);
    this.model.bind('reset', this.render, this);
    // add this number to the count when displayed. usefull for owner + curator case.
    this.options.init = this.options.init || 0; 
  },

  render: function() {
    $(this.el).html(this.template({count: this.options.init + this.model.length}));
  }

});
