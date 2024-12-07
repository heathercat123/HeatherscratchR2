var Scratch = Scratch || {};
Scratch.EducatorStuff = Scratch.EducatorStuff || {};

Scratch.EducatorStuff.Page = Backbone.View.extend(
_.extend({}, Scratch.Mixins.Pagination, {
  events: {
  },

  initialize: function() {
    this.events = _.extend({}, this.events, Scratch.Mixins.Pagination.events);
    _.bindAll(this, 'loaded');
    this.resetParams(); /* reset pagination parameters */
    $(this.el).html(this.options.template(this.model.toJSON()));
    this.list = this.$('[data-content="list"]').addClass('loading');
    this.list.append($('<div class="ajax-loader"></div>'));

    if (this.options.type == 'gallery') {
      this.header = new Scratch.EducatorStuff.ClassroomGalleryHeaderView({model: this.model});
      this.list = new Scratch.EducatorStuff.ClassroomGalleryThumbnailCollectionView({model: this.model});
    } else if (this.options.type == 'student') {
      this.header = new Scratch.EducatorStuff.ClassroomStudentHeaderView({model: this.model});
      this.list = new Scratch.EducatorStuff.ClassroomStudentThumbnailCollectionView({model: this.model});
    } else if (this.options.type == 'classrooms') {
      this.list = new Scratch.EducatorStuff.ClassroomThumbnailCollectionView({model: this.model});
    } else if (this.options.type == 'alerts') {
      this.list = new Scratch.EducatorStuff.ClassroomAlertThumbnailCollectionView({model: this.model});
    } else if (this.options.type == 'activity') {
      this.list = new Scratch.EducatorStuff.ClassroomActivityThumbnailCollectionView({model: this.model});
    }
  },
  render: function() {
    this.model.fetch({success: this.loaded});
  },
 loadMore: function(e) {
    // TODO: turn off pagination when there are no more pages returned
    // add the load more ajax-loader, if it hasn't already been done
    if(!this.$('[data-control="load-more"] .ajax-loader').length){
      this.$('[data-control="load-more"]').append($('<div class="ajax-loader"></div>'));
    }

    this.$('[data-control="load-more"] .ajax-loader').show();
    this.paginationData.page += 1;
    this.model.fetch({
      add: true,
      data: this.paginationData,
      success: function(){
        this.$('[data-control="load-more"] .ajax-loader').hide();
      }.bind(this),
      error: function(collection, response, jqXHR){
        this.$('[data-control="load-more"] .ajax-loader').hide();
        if (response.status == 404) {
          this.$('[data-control="load-more"]').hide();

        }
      }.bind(this)
    });
  },
  sortBy: function(eventObj) {
    this.resetParams();
    var sortObj = {
      ascsort: $(eventObj.target).data('ascsort') || '',
      descsort: $(eventObj.target).data('descsort') || '',
    };
    $.extend(this.paginationData, sortObj);
    this.$('[data-content="list"] .ajax-loader').show();
    this.reload(this.reloaded);
  },
  filter: function(eventObj) {
    this.resetParams();
    // set the filter value, which will be appended to the URL
    this.model.meta('filter', $(eventObj.target).data('filter'));
    this.$('[data-content="list"] .ajax-loader').show();
    this.reload(this.reloaded);
  },
  loaded: function() {
    if(this.header != undefined){
      this.header.render();
      this.$('#classroom-tab-header').html(this.header.el);
    }
    this.$('[data-content="list"]').append(this.list.el);
    this.$('[data-content="list"]').removeClass('loading');
    this.$('[data-content="list"] .ajax-loader').hide();
    if (this.model.models.length <= 0) {
      this.$('[data-control="load-more"]').hide();
    }
  },
  reloaded: function(){
    this.$('[data-content="list"] .ajax-loader').hide();
  },
  onClose: function() {
    this.list.close();
    if(this.header != undefined){
      this.header.close();
    }
  },

}));



